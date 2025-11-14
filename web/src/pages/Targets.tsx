import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTargets, createTarget, updateTarget, deleteTarget } from '../services/targetService';
import { getTransactions } from '../services/transactionService';
import { format, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isBefore } from 'date-fns';
import type { Target, PeriodType, TargetType } from '../types';

export default function Targets() {
  const { user } = useAuth();
  const [targets, setTargets] = useState<Target[]>([]);
  const [targetProgress, setTargetProgress] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'savings' as TargetType,
    amount: '',
    period_type: 'monthly' as PeriodType,
    deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (user) {
      loadTargets();
    }
  }, [user]);

  useEffect(() => {
    if (user && targets.length > 0) {
      calculateProgress();
    }
  }, [user, targets]);

  const loadTargets = async () => {
    if (!user) return;
    try {
      const data = await getTargets(user.id);
      setTargets(data || []);
    } catch (error) {
      console.error('Error loading targets:', error);
    }
  };

  const calculateProgress = async () => {
    if (!user) return;

    const progress: Record<string, number> = {};

    for (const target of targets) {
      try {
        let startDate: Date;
        let endDate: Date = new Date(target.deadline);

        switch (target.period_type) {
          case 'daily':
            startDate = startOfDay(new Date());
            endDate = endOfDay(new Date());
            break;
          case 'weekly':
            startDate = startOfWeek(new Date());
            endDate = endOfWeek(new Date());
            break;
          case 'monthly':
            startDate = startOfMonth(new Date());
            endDate = endOfMonth(new Date());
            break;
        }

        const transactions = await getTransactions(user.id, {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          type: target.type === 'savings' ? 'income' : 'expense',
        });

        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        progress[target.id] = total;
      } catch (error) {
        console.error('Error calculating progress:', error);
        progress[target.id] = 0;
      }
    }

    setTargetProgress(progress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.amount || parseFloat(formData.amount) <= 0) return;

    setLoading(true);
    try {
      const targetData = {
        user_id: user.id,
        type: formData.type,
        amount: parseFloat(formData.amount),
        period_type: formData.period_type,
        deadline: formData.deadline,
      };

      if (editingTarget) {
        await updateTarget(editingTarget.id, targetData);
      } else {
        await createTarget(targetData);
      }
      setShowForm(false);
      setEditingTarget(null);
      setFormData({
        type: 'savings',
        amount: '',
        period_type: 'monthly',
        deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      });
      loadTargets();
    } catch (error) {
      console.error('Error saving target:', error);
      alert('Failed to save target');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this target?')) return;

    setLoading(true);
    try {
      await deleteTarget(id);
      loadTargets();
    } catch (error) {
      console.error('Error deleting target:', error);
      alert('Failed to delete target');
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (target: Target) => {
    const current = targetProgress[target.id] || 0;
    const percentage = (current / target.amount) * 100;
    return { current, percentage: Math.min(percentage, 100) };
  };

  const isCompleted = (target: Target) => {
    const { current } = getProgress(target);
    return current >= target.amount;
  };

  const isOverdue = (target: Target) => {
    return isBefore(new Date(target.deadline), new Date()) && !isCompleted(target);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Targets</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTarget(null);
              setFormData({
                type: 'savings',
                amount: '',
                period_type: 'monthly',
                deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
              });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Target
          </button>
        </div>

        {/* Target Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingTarget ? 'Edit Target' : 'Add Target'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TargetType })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="savings">Savings</option>
                    <option value="spending">Spending</option>
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
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTarget(null);
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
                    {loading ? 'Saving...' : editingTarget ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Targets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target) => {
            const { current, percentage } = getProgress(target);
            const completed = isCompleted(target);
            const overdue = isOverdue(target);

            return (
              <div
                key={target.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  completed ? 'border-2 border-green-500' : overdue ? 'border-2 border-red-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {target.type} Target
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {target.period_type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Deadline: {format(new Date(target.deadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {completed && <span className="text-2xl">✅</span>}
                  {overdue && <span className="text-2xl">⏰</span>}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {current.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })}
                      {' / '}
                      {target.amount.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        completed ? 'bg-green-500' : overdue ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {percentage.toFixed(1)}% complete
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTarget(target);
                      setFormData({
                        type: target.type,
                        amount: target.amount.toString(),
                        period_type: target.period_type,
                        deadline: target.deadline,
                      });
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(target.id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {targets.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No targets set. Add your first target to start tracking your goals!
          </div>
        )}
      </div>
    </div>
  );
}

