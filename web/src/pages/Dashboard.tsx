import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { getTransactions } from '../services/transactionService';
import { checkLimitViolations } from '../services/limitService';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import LimitWarning from '../components/LimitWarning';
import Navigation from '../components/Navigation';
import { getPaydayDate } from '../services/userSettingsService';
import {
  getPaydayPeriodStart,
  getPaydayPeriodEnd,
  getPreviousPaydayPeriod,
  getPaydayPeriods,
  formatPaydayPeriod,
} from '../utils/paydayPeriod';
import type { Transaction } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'last'>('current');
  const [paydayDate, setPaydayDate] = useState<number>(1);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);

  // Load payday date
  useEffect(() => {
    if (user) {
      getPaydayDate(user.id).then(setPaydayDate);
    }
  }, [user]);

  // Calculate period dates based on payday
  const getPeriodDates = () => {
    if (selectedPeriod === 'current') {
      const start = getPaydayPeriodStart(paydayDate);
      const end = getPaydayPeriodEnd(paydayDate);
      return { start, end };
    } else {
      const prev = getPreviousPaydayPeriod(paydayDate);
      return { start: prev.start, end: prev.end };
    }
  };

  const { start, end } = getPeriodDates();
  const startDate = format(start, 'yyyy-MM-dd');
  const endDate = format(end, 'yyyy-MM-dd');

  const { transactions, loading } = useTransactions(user?.id, {
    startDate,
    endDate,
  });

  const { categories } = useCategories(user?.id);

  useEffect(() => {
    if (user && transactions.length > 0) {
      calculateStats();
      calculateMonthlyData();
      calculateCategoryData();
      checkViolations();
    }
  }, [user, transactions, selectedPeriod, paydayDate]);

  const calculateStats = () => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome - totalExpense);
  };

  const calculateMonthlyData = async () => {
    if (!user) return;

    const periods = getPaydayPeriods(paydayDate, 6);
    const months = [];

    for (const period of periods) {
      try {
        const periodTransactions = await getTransactions(user.id, {
          startDate: format(period.start, 'yyyy-MM-dd'),
          endDate: format(period.end, 'yyyy-MM-dd'),
        });

        const periodIncome = periodTransactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        const periodExpense = periodTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        months.push({
          month: format(period.start, 'MMM dd'),
          income: periodIncome,
          expense: periodExpense,
        });
      } catch (error) {
        console.error('Error calculating period data:', error);
      }
    }

    setMonthlyData(months);
  };

  const calculateCategoryData = () => {
    const categoryMap = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const categoryName = categories.find((c) => c.id === t.category_id)?.name || 'Unknown';
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + t.amount);
      });

    const data = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    setCategoryData(data);
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

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LimitWarning userId={user?.id} />
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Period Selector */}
        <div className="mb-6 flex justify-end">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow">
            <button
              onClick={() => setSelectedPeriod('current')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPeriod === 'current'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Current Period
            </button>
            <button
              onClick={() => setSelectedPeriod('last')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPeriod === 'last'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Last Period
            </button>
          </div>
        </div>
        <div className="mt-2 text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Period: {formatPaydayPeriod(paydayDate)}
          </p>
        </div>

        {/* Violations Warning */}
        {violations.filter((v) => v.is_violated).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
              ⚠️ Spending Limit Exceeded!
            </h3>
            <p className="text-red-700 dark:text-red-300">
              You have exceeded {violations.filter((v) => v.is_violated).length} spending limit(s)
            </p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Balance</h3>
            <p
              className={`text-3xl font-bold ${
                balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {balance.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Income</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {income.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Expense</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {expense.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expense Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Income vs Expense (6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Category Breakdown
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <Link
              to="/transactions"
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No transactions found
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getCategoryName(transaction.category_id)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
