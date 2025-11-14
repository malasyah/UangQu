import * as XLSX from 'xlsx';
import type { ParsedTransaction } from './csvImport';

export function parseExcel(file: File): Promise<ParsedTransaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          reject(new Error('Excel file must have at least a header row and one data row'));
          return;
        }
        
        // Find header row (first row)
        const headers = jsonData[0].map((h: any) => 
          String(h || '').trim().toLowerCase().replace(/^"|"$/g, '')
        );
        
        const dateIndex = headers.findIndex((h: string) => h === 'date');
        const categoryIndex = headers.findIndex((h: string) => h === 'category');
        const typeIndex = headers.findIndex((h: string) => h === 'type');
        const amountIndex = headers.findIndex((h: string) => h === 'amount');
        const descriptionIndex = headers.findIndex((h: string) => h === 'description');
        
        if (dateIndex === -1 || categoryIndex === -1 || typeIndex === -1 || amountIndex === -1) {
          reject(new Error('Excel must contain Date, Category, Type, and Amount columns'));
          return;
        }
        
        const transactions: ParsedTransaction[] = [];
        
        // Process data rows (skip header)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          if (!row || row.length < 4) continue;
          
          const date = String(row[dateIndex] || '').trim();
          const category = String(row[categoryIndex] || '').trim();
          const type = String(row[typeIndex] || '').trim().toLowerCase();
          const amount = parseFloat(String(row[amountIndex] || '0'));
          const description = descriptionIndex !== -1 ? String(row[descriptionIndex] || '').trim() : undefined;
          
          // Convert Excel date to YYYY-MM-DD format if needed
          let formattedDate = date;
          if (XLSX.SSF.parse_date_code && typeof row[dateIndex] === 'number') {
            // Excel date serial number
            const excelDate = XLSX.SSF.parse_date_code(row[dateIndex]);
            formattedDate = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
          } else if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // Try to parse other date formats
            try {
              const parsedDate = new Date(date);
              if (!isNaN(parsedDate.getTime())) {
                formattedDate = parsedDate.toISOString().split('T')[0];
              }
            } catch {
              // Keep original date
            }
          }
          
          if (!formattedDate || !category || (type !== 'income' && type !== 'expense') || isNaN(amount)) {
            continue;
          }
          
          transactions.push({
            date: formattedDate,
            category,
            type: type as 'income' | 'expense',
            amount,
            description: description || undefined,
          });
        }
        
        resolve(transactions);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

