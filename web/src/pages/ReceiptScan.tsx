import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import Navigation from '../components/Navigation';
import { createTransaction } from '../services/transactionService';
import { processReceiptImage, type ReceiptData } from '../utils/receiptOCR';
import { format } from 'date-fns';

export default function ReceiptScan() {
  const { user } = useAuth();
  const { categories } = useCategories(user?.id);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    date: '',
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setImageFile(file);
    setError(null);
    setReceiptData(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imageFile) return;

    setProcessing(true);
    setProcessingProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const data = await processReceiptImage(imageFile);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      setReceiptData(data);

      // Pre-fill form with extracted data
      setFormData({
        category_id: '',
        amount: data.total?.toString() || '',
        date: data.date || format(new Date(), 'yyyy-MM-dd'),
        description: data.merchant || data.items?.join(', ') || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process receipt');
    } finally {
      setProcessing(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.category_id || !formData.amount || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createTransaction({
        user_id: user.id,
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        type: 'expense',
        date: formData.date,
        description: formData.description || undefined,
      });

      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setReceiptData(null);
      setFormData({
        category_id: '',
        amount: '',
        date: '',
        description: '',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('Transaction saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setImageFile(null);
    setImagePreview(null);
    setReceiptData(null);
    setFormData({
      category_id: '',
      amount: '',
      date: '',
      description: '',
    });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          📸 Scan Receipt
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Upload Receipt Image
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload a photo of your receipt. The app will automatically extract the date, amount, and merchant information.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Receipt Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview:
                </p>
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}

            {imageFile && !receiptData && (
              <button
                onClick={handleScan}
                disabled={processing}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? `Processing... ${processingProgress}%` : 'Scan Receipt'}
              </button>
            )}

            {processing && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {receiptData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Extracted Information
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Raw Text (for reference):
              </h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {receiptData.rawText}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Merchant:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {receiptData.merchant || 'Not detected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {receiptData.total ? `Rp ${receiptData.total.toLocaleString('id-ID')}` : 'Not detected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {receiptData.date || 'Not detected'}
                </p>
              </div>
              {receiptData.items && receiptData.items.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Items:</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {receiptData.items.length} items detected
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Confirm Transaction Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Merchant name, items, etc."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !formData.category_id || !formData.amount || !formData.date}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Transaction'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

