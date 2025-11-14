import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { createTransaction, updateTransaction } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import type { Transaction, Category, TransactionType } from '../types';

type RootStackParamList = {
  Transactions: undefined;
  TransactionForm: { transaction?: Transaction };
};

type TransactionFormScreenRouteProp = RouteProp<RootStackParamList, 'TransactionForm'>;
type TransactionFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TransactionForm'>;

export default function TransactionFormScreen() {
  const navigation = useNavigation<TransactionFormScreenNavigationProp>();
  const route = useRoute<TransactionFormScreenRouteProp>();
  const { user } = useAuth();
  const transaction = route.params?.transaction;

  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [categoryId, setCategoryId] = useState(transaction?.category_id || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [date, setDate] = useState(transaction ? new Date(transaction.date) : new Date());
  const [description, setDescription] = useState(transaction?.description || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [user, type]);

  const loadCategories = async () => {
    if (!user) return;

    try {
      setCategoriesLoading(true);
      const data = await getCategories(user.id, type);
      setCategories(data || []);
      if (data && data.length > 0 && !categoryId) {
        setCategoryId(data[0].id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !categoryId || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        user_id: user.id,
        category_id: categoryId,
        amount: parseFloat(amount),
        type,
        date: format(date, 'yyyy-MM-dd'),
        description: description || undefined,
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{transaction ? 'Edit Transaction' : 'Add Transaction'}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
              onPress={() => {
                setType('income');
                setCategoryId('');
              }}
            >
              <Text
                style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
              onPress={() => {
                setType('expense');
                setCategoryId('');
              }}
            >
              <Text
                style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          {categoriesLoading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    categoryId === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      categoryId === cat.id && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{format(date, 'MMM dd, yyyy')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note..."
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {transaction ? 'Update' : 'Create'} Transaction
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

