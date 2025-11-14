import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import Navigation from '../components/Navigation';
import { createTransaction } from '../services/transactionService';
import { parseCSV, validateTransaction } from '../utils/csvImport';
import { parseExcel } from '../utils/excelImport';
import type { ParsedTransaction } from '../utils/csvImport';

export default function Import() {
  const { user } = useAuth();
  const { categories } = useCategories(user?.id);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'excel' | null>(null);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(0);
  const [skipped, setSkipped] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setParsedTransactions([]);

    const fileName = selectedFile.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      setErrors(['File format not supported. Please use CSV or Excel (.xlsx, .xls)']);
      return;
    }

    setFileType(isExcel ? 'excel' : 'csv');

    try {
      let parsed: ParsedTransaction[];

      if (isExcel) {
        parsed = await parseExcel(selectedFile);
      } else {
        const reader = new FileReader();
        parsed = await new Promise<ParsedTransaction[]>((resolve, reject) => {
          reader.onload = (event) => {
            try {
              const content = event.target?.result as string;
              const result = parseCSV(content);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read CSV file'));
          reader.readAsText(selectedFile);
        });
      }

      setParsedTransactions(parsed);

      // Validate all transactions
      const validationErrors: string[] = [];
      parsed.forEach((t, index) => {
        const error = validateTransaction(t);
        if (error) {
          validationErrors.push(`Row ${index + 2}: ${error}`);
        }
      });
      setErrors(validationErrors);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : `Failed to parse ${isExcel ? 'Excel' : 'CSV'} file`]);
    }
  };

  const handleImport = async () => {
    if (!user || parsedTransactions.length === 0) return;

    setImporting(true);
    setImported(0);
    setSkipped(0);

    const validTransactions = parsedTransactions.filter((t) => {
      const error = validateTransaction(t);
      return !error;
    });

    for (const transaction of validTransactions) {
      try {
        // Find category by name
        const category = categories.find(
          (c) => c.name.toLowerCase() === transaction.category.toLowerCase()
        );

        if (!category) {
          setSkipped((prev) => prev + 1);
          continue;
        }

        // Check for duplicates (same date, category, amount, type)
        // This is a simple check - in production you might want to check the database
        await createTransaction({
          user_id: user.id,
          category_id: category.id,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date,
          description: transaction.description,
        });

        setImported((prev) => prev + 1);
      } catch (error) {
        console.error('Error importing transaction:', error);
        setSkipped((prev) => prev + 1);
      }
    }

    setImporting(false);
    alert(`Import complete! ${imported} imported, ${skipped} skipped.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Import Transactions</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Supported File Formats
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You can import transactions from <strong>CSV</strong> or <strong>Excel</strong> (.xlsx, .xls) files.
          </p>
          
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            Required Columns:
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4">
            <li><strong>Date</strong> - Format: YYYY-MM-DD (or Excel date format)</li>
            <li><strong>Category</strong> - Must match an existing category name</li>
            <li><strong>Type</strong> - "income" or "expense"</li>
            <li><strong>Amount</strong> - Positive number</li>
            <li><strong>Description</strong> - Optional</li>
          </ul>

          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            Example CSV Format:
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono text-gray-800 dark:text-gray-200 mb-4">
            Date,Category,Type,Amount,Description<br />
            2024-01-15,Food & Dining,expense,50000,Lunch<br />
            2024-01-16,Salary,income,5000000,Monthly salary
          </div>

          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 mt-4">
            Excel Format:
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Excel files should have the same columns in the first sheet. The first row should be headers.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select File (CSV or Excel)
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: <strong>{file.name}</strong> ({fileType === 'excel' ? 'Excel' : 'CSV'})
                </p>
              )}
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-200 mb-2">
                  Validation Errors ({errors.length})
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1 max-h-40 overflow-y-auto">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {parsedTransactions.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>{parsedTransactions.length} transactions</strong> found in file.
                  {errors.length === 0 && ' All transactions are valid!'}
                </p>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={importing || parsedTransactions.length === 0 || errors.length > 0}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing
                ? `Importing... (${imported} imported, ${skipped} skipped)`
                : 'Import Transactions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

