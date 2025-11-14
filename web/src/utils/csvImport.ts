import type { Transaction, TransactionType } from '../types';

export interface ParsedTransaction {
  date: string;
  category: string;
  type: TransactionType;
  amount: number;
  description?: string;
}

export function parseCSV(content: string): ParsedTransaction[] {
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
  
  const dateIndex = headers.findIndex((h) => h === 'date');
  const categoryIndex = headers.findIndex((h) => h === 'category');
  const typeIndex = headers.findIndex((h) => h === 'type');
  const amountIndex = headers.findIndex((h) => h === 'amount');
  const descriptionIndex = headers.findIndex((h) => h === 'description');

  if (dateIndex === -1 || categoryIndex === -1 || typeIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain Date, Category, Type, and Amount columns');
  }

  const transactions: ParsedTransaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    
    if (values.length < 4) continue;

    const date = values[dateIndex];
    const category = values[categoryIndex];
    const type = values[typeIndex] as TransactionType;
    const amount = parseFloat(values[amountIndex]);
    const description = descriptionIndex !== -1 ? values[descriptionIndex] : undefined;

    if (!date || !category || !type || isNaN(amount)) {
      continue;
    }

    if (type !== 'income' && type !== 'expense') {
      continue;
    }

    transactions.push({
      date,
      category,
      type,
      amount,
      description,
    });
  }

  return transactions;
}

export function validateTransaction(transaction: ParsedTransaction): string | null {
  if (!transaction.date || !/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)) {
    return 'Invalid date format. Expected YYYY-MM-DD';
  }

  if (!transaction.category || transaction.category.trim() === '') {
    return 'Category is required';
  }

  if (transaction.type !== 'income' && transaction.type !== 'expense') {
    return 'Type must be either "income" or "expense"';
  }

  if (isNaN(transaction.amount) || transaction.amount <= 0) {
    return 'Amount must be a positive number';
  }

  return null;
}

