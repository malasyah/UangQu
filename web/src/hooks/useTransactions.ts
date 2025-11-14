import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import type { Transaction, TransactionType } from '../types';

interface UseTransactionsFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
}

export function useTransactions(userId: string | undefined, filters?: UseTransactionsFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions(userId, filters);
        setTransactions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [userId, filters?.startDate, filters?.endDate, filters?.categoryId, filters?.type]);

  return { transactions, loading, error, refetch: () => {
    if (userId) {
      getTransactions(userId, filters).then(setTransactions).catch(setError);
    }
  } };
}

