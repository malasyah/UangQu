import Tesseract from 'tesseract.js';

export interface ReceiptData {
  date?: string;
  total?: number;
  merchant?: string;
  items?: string[];
  rawText: string;
}

export async function extractTextFromImage(imageFile: File): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
    logger: (m) => {
      // Progress logging can be added here if needed
      if (m.status === 'recognizing text') {
        // console.log(`Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });
  return text;
}

export function parseReceiptText(text: string): ReceiptData {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ReceiptData = {
    rawText: text,
    items: [],
  };

  // Extract date patterns (various formats)
  const datePatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s\.\-]+\d{1,2}[\s,\.\-]+\d{2,4}/gi,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      try {
        const parsedDate = new Date(match[0]);
        if (!isNaN(parsedDate.getTime())) {
          result.date = parsedDate.toISOString().split('T')[0];
          break;
        }
      } catch {
        // Continue to next pattern
      }
    }
  }

  // If no date found, use today's date
  if (!result.date) {
    result.date = new Date().toISOString().split('T')[0];
  }

  // Extract total amount (look for patterns like "TOTAL", "TOTAL:", "GRAND TOTAL", etc.)
  const totalPatterns = [
    /(?:total|grand total|amount due|balance|sum)[\s:]*[\$]?[\s]*([\d,]+\.?\d*)/gi,
    /[\$]?[\s]*([\d,]+\.?\d*)[\s]*(?:total|grand total)/gi,
    /(?:rp|idr)[\s:]*[\s]*([\d,]+\.?\d*)/gi,
  ];

  for (const pattern of totalPatterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      // Get the last match (usually the final total)
      const lastMatch = matches[matches.length - 1];
      const amountStr = lastMatch[1]?.replace(/,/g, '');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        result.total = amount;
        break;
      }
    }
  }

  // If no total found, look for the largest number that might be the total
  if (!result.total) {
    const numberPattern = /[\$]?[\s]*(?:rp|idr)?[\s]*([\d,]+\.?\d*)/gi;
    const numbers: number[] = [];
    let match;
    while ((match = numberPattern.exec(text)) !== null) {
      const num = parseFloat(match[1]?.replace(/,/g, '') || '0');
      if (!isNaN(num) && num > 0) {
        numbers.push(num);
      }
    }
    if (numbers.length > 0) {
      // Take the largest number as total
      result.total = Math.max(...numbers);
    }
  }

  // Extract merchant name (usually in first few lines)
  const merchantKeywords = ['store', 'shop', 'restaurant', 'cafe', 'market', 'supermarket', 'mall', 'toko', 'warung', 'restoran'];
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].toLowerCase();
    if (line.length > 3 && line.length < 50) {
      // Check if line doesn't look like a price or date
      if (!/[\$]|rp|idr|\d{1,2}[\/\-\.]\d/.test(line)) {
        result.merchant = lines[i];
        break;
      }
    }
  }

  // Extract items (lines that might be products)
  for (const line of lines) {
    // Skip lines that are clearly not items
    if (
      line.toLowerCase().includes('total') ||
      line.toLowerCase().includes('subtotal') ||
      line.toLowerCase().includes('tax') ||
      line.toLowerCase().includes('discount') ||
      line.match(/^\d{1,2}[\/\-\.]\d/) || // Date
      line.match(/^[\$]?[\s]*(?:rp|idr)?[\s]*[\d,]+\.?\d*$/) // Just a number
    ) {
      continue;
    }
    
    // If line has text and possibly a price, it might be an item
    if (line.length > 3 && line.length < 100) {
      result.items?.push(line);
    }
  }

  // Limit items to reasonable number
  if (result.items && result.items.length > 10) {
    result.items = result.items.slice(0, 10);
  }

  return result;
}

export async function processReceiptImage(imageFile: File): Promise<ReceiptData> {
  const text = await extractTextFromImage(imageFile);
  return parseReceiptText(text);
}

