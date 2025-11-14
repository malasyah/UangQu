import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import type { Transaction, Category, TransactionType } from '../types';

type RootStackParamList = {
  Transactions: undefined;
  TransactionForm: { transaction?: Transaction };
};

type TransactionsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Transactions'>;

export default function TransactionsScreen() {
  const navigation = useNavigation<TransactionsScreenNavigationProp>();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, filterType]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(user.id, filterType !== 'all' ? { type: filterType } : undefined),
        getCategories(user.id),
      ]);
      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(id);
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete transaction');
          }
        },
      },
    ]);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const renderSwipeableRow = (transaction: Transaction) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <View style={styles.swipeActions}>
            <TouchableOpacity
              style={styles.swipeButton}
              onPress={() => navigation.navigate('TransactionForm', { transaction })}
            >
              <Text style={styles.swipeButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swipeButton, styles.deleteButton]}
              onPress={() => handleDelete(transaction.id)}
            >
              <Text style={styles.swipeButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <View style={styles.transactionItem}>
          <View style={styles.transactionInfo}>
            <Text style={styles.categoryName}>{getCategoryName(transaction.category_id)}</Text>
            <Text style={styles.dateText}>
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </Text>
            {transaction.description && (
              <Text style={styles.descriptionText} numberOfLines={1}>
                {transaction.description}
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.amountText,
              transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {transaction.amount.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            })}
          </Text>
        </View>
      </Swipeable>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TransactionForm')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
          onPress={() => setFilterType('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'income' && styles.filterButtonActive]}
          onPress={() => setFilterType('income')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'income' && styles.filterButtonTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilterType('expense')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterType === 'expense' && styles.filterButtonTextActive,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No transactions found</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TransactionForm')}
          >
            <Text style={styles.addButtonText}>Add Your First Transaction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderSwipeableRow(item)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#999',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#10b981',
  },
  expenseAmount: {
    color: '#ef4444',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  swipeButton: {
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    marginLeft: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  swipeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
});

