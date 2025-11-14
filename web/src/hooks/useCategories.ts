import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';
import type { Category, TransactionType } from '../types';

export function useCategories(userId: string | undefined, type?: TransactionType) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories(userId, type);
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [userId, type]);

  return { categories, loading, error, refetch: () => {
    if (userId) {
      getCategories(userId, type).then(setCategories).catch(setError);
    }
  } };
}

