import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import { createOrUpdateUserSettings, getPaydayDate } from '../services/userSettingsService';
import { formatPaydayPeriod } from '../utils/paydayPeriod';

export default function Settings() {
  const { user } = useAuth();
  const [paydayDate, setPaydayDate] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    try {
      const date = await getPaydayDate(user.id);
      setPaydayDate(date);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (paydayDate < 1 || paydayDate > 31) {
      setMessage({ type: 'error', text: 'Payday date must be between 1 and 31' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await createOrUpdateUserSettings(user.id, paydayDate);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const currentPeriod = formatPaydayPeriod(paydayDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            💰 Payday Settings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Set your payday date. All financial reports, limits, and targets will be calculated
            based on your payday period (from payday to day before next payday).
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payday Date (Day of Month)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={paydayDate}
                  onChange={(e) => setPaydayDate(parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  (1-31)
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter the day of the month when you receive your salary (e.g., 1, 5, 25)
              </p>
            </div>

            {paydayDate >= 1 && paydayDate <= 31 && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-1">
                  Current Payday Period:
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  {currentPeriod}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                  All reports and limits will be calculated for this period
                </p>
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || paydayDate < 1 || paydayDate > 31}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ℹ️ How Payday Period Works
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-900 dark:text-white">Example:</strong> If your payday is on the 25th:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Period starts: 25th of each month</li>
              <li>Period ends: 24th of next month</li>
              <li>So if today is January 15, your current period is Dec 25 - Jan 24</li>
            </ul>
            <p className="mt-4">
              All financial calculations (dashboard, limits, targets, reports) will use this
              payday period instead of calendar month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

