import type { Transaction } from '../types';
import { format } from 'date-fns';

export function exportTransactionsToCSV(
  transactions: Transaction[],
  categories: Map<string, string>
): string {
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];
  const rows = transactions.map((t) => [
    format(new Date(t.date), 'yyyy-MM-dd'),
    categories.get(t.category_id) || 'Unknown',
    t.type,
    t.amount.toString(),
    t.description || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

