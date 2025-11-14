import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { createTransaction } from '../services/transactionService';
import { parseCSV, validateTransaction } from '../utils/csvImport';
import type { ParsedTransaction } from '../utils/csvImport';

export default function Import() {
  const { user } = useAuth();
  const { categories } = useCategories(user?.id);
  const [file, setFile] = useState<File | null>(null);
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

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseCSV(content);
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
        setErrors([error instanceof Error ? error.message : 'Failed to parse CSV file']);
      }
    };
    reader.readAsText(selectedFile);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Import Transactions</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            CSV File Format
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Your CSV file should have the following columns:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mb-4">
            <li>Date (format: YYYY-MM-DD)</li>
            <li>Category (must match an existing category name)</li>
            <li>Type (income or expense)</li>
            <li>Amount (positive number)</li>
            <li>Description (optional)</li>
          </ul>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono text-gray-800 dark:text-gray-200">
            Date,Category,Type,Amount,Description<br />
            2024-01-15,Food & Dining,expense,50000,Lunch
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
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

