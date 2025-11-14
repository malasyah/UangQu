import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLimits, createLimit, updateLimit, deleteLimit, checkLimitViolations } from '../services/limitService';
import { useCategories } from '../hooks/useCategories';
import LimitWarning from '../components/LimitWarning';
import Navigation from '../components/Navigation';
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { getPaydayDate } from '../services/userSettingsService';
import {
  getPaydayPeriodStart,
  getPaydayPeriodEnd,
} from '../utils/paydayPeriod';
import type { Limit, PeriodType } from '../types';

export default function Limits() {
  const { user } = useAuth();
  const { categories } = useCategories(user?.id);
  const [limits, setLimits] = useState<Limit[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [paydayDate, setPaydayDate] = useState<number>(1);
  const [showForm, setShowForm] = useState(false);
  const [editingLimit, setEditingLimit] = useState<Limit | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    period_type: 'monthly' as PeriodType,
    amount: '',
    category_id: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (user) {
      getPaydayDate(user.id).then(setPaydayDate);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadLimits();
      checkViolations();
    }
  }, [user]);

  const loadLimits = async () => {
    if (!user) return;
    try {
      const data = await getLimits(user.id);
      setLimits(data || []);
    } catch (error) {
      console.error('Error loading limits:', error);
    }
  };

  const checkViolations = async () => {
    if (!user) return;
    try {
      const data = await checkLimitViolations(user.id);
      setViolations(data || []);
    } catch (error) {
      console.error('Error checking violations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.amount || parseFloat(formData.amount) <= 0) return;

    setLoading(true);
    try {
      const limitData = {
        user_id: user.id,
        period_type: formData.period_type,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id || null,
        start_date: formData.start_date,
      };

      if (editingLimit) {
        await updateLimit(editingLimit.id, limitData);
      } else {
        await createLimit(limitData);
      }
      setShowForm(false);
      setEditingLimit(null);
      setFormData({
        period_type: 'monthly',
        amount: '',
        category_id: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
      });
      loadLimits();
      checkViolations();
    } catch (error) {
      console.error('Error saving limit:', error);
      alert('Failed to save limit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this limit?')) return;

    setLoading(true);
    try {
      await deleteLimit(id);
      loadLimits();
      checkViolations();
    } catch (error) {
      console.error('Error deleting limit:', error);
      alert('Failed to delete limit');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'All Categories';
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const getCurrentPeriodSpending = (limit: Limit) => {
    const violation = violations.find((v) => v.limit_id === limit.id);
    return violation ? violation.current_spending : 0;
  };

  const isViolated = (limit: Limit) => {
    return violations.some((v) => v.limit_id === limit.id && v.is_violated);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <LimitWarning userId={user?.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spending Limits</h1>
          <button
            onClick={async () => {
              const payday = user ? await getPaydayDate(user.id) : 1;
              const periodStart = getPaydayPeriodStart(payday);
              setShowForm(true);
              setEditingLimit(null);
              setFormData({
                period_type: 'monthly',
                amount: '',
                category_id: '',
                start_date: format(periodStart, 'yyyy-MM-dd'),
              });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Limit
          </button>
        </div>

        {/* Violations Warning */}
        {violations.filter((v) => v.is_violated).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
              ⚠️ Limit Violations Detected!
            </h3>
            <p className="text-red-700 dark:text-red-300">
              You have exceeded {violations.filter((v) => v.is_violated).length} spending limit(s)
            </p>
          </div>
        )}

        {/* Limit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingLimit ? 'Edit Limit' : 'Add Limit'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period Type
                  </label>
                  <select
                    value={formData.period_type}
                    onChange={(e) =>
                      setFormData({ ...formData, period_type: e.target.value as PeriodType })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category (optional - leave empty for all categories)
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories
                      .filter((c) => c.type === 'expense')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingLimit(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingLimit ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Limits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {limits.map((limit) => {
            const currentSpending = getCurrentPeriodSpending(limit);
            const percentage = (currentSpending / limit.amount) * 100;
            const violated = isViolated(limit);

            return (
              <div
                key={limit.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  violated ? 'border-2 border-red-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {limit.period_type} Limit
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getCategoryName(limit.category_id || null)}
                    </p>
                  </div>
                  {violated && <span className="text-2xl">⚠️</span>}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {currentSpending.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })}
                      {' / '}
                      {limit.amount.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        violated ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingLimit(limit);
                      setFormData({
                        period_type: limit.period_type,
                        amount: limit.amount.toString(),
                        category_id: limit.category_id || '',
                        start_date: limit.start_date,
                      });
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(limit.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {limits.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No limits set. Add your first spending limit to start tracking!
          </div>
        )}
      </div>
    </div>
  );
}

