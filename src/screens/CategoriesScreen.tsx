import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import type { Category, TransactionType } from '../types';

const DEFAULT_CATEGORIES: { name: string; type: TransactionType; icon: string; color: string }[] = [
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444' },
  { name: 'Transportation', type: 'expense', icon: '🚗', color: '#f59e0b' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#8b5cf6' },
  { name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#06b6d4' },
  { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#ec4899' },
  { name: 'Health & Fitness', type: 'expense', icon: '💊', color: '#10b981' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#3b82f6' },
  { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: '💼', color: '#3b82f6' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#8b5cf6' },
  { name: 'Gift', type: 'income', icon: '🎁', color: '#ec4899' },
];

export default function CategoriesScreen() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TransactionType,
    icon: '📝',
    color: '#6366f1',
  });

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getCategories(user.id);
      setCategories(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory({ ...formData, user_id: user.id });
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', type: 'expense', icon: '📝', color: '#6366f1' });
      loadCategories();
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
            loadCategories();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete category');
          }
        },
      },
    ]);
  };

  const handleAddDefault = async (defaultCat: typeof DEFAULT_CATEGORIES[0]) => {
    if (!user) return;

    try {
      await createCategory({
        user_id: user.id,
        name: defaultCat.name,
        type: defaultCat.type,
        icon: defaultCat.icon,
        color: defaultCat.color,
      });
      loadCategories();
    } catch (error) {
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (showForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Category name"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'expense' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'expense' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'income' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'income' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'income' && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Icon (emoji)</Text>
          <TextInput
            style={styles.input}
            value={formData.icon}
            onChangeText={(text) => setFormData({ ...formData, icon: text })}
            placeholder="📝"
            maxLength={2}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowForm(false);
                setEditingCategory(null);
                setFormData({ name: '', type: 'expense', icon: '📝', color: '#6366f1' });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {editingCategory ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setShowForm(true);
            setEditingCategory(null);
            setFormData({ name: '', type: 'expense', icon: '📝', color: '#6366f1' });
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {categories.length === 0 && (
        <View style={styles.defaultSection}>
          <Text style={styles.sectionTitle}>Quick Add Default Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DEFAULT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={styles.defaultCategoryButton}
                onPress={() => handleAddDefault(cat)}
              >
                <Text style={styles.defaultCategoryIcon}>{cat.icon}</Text>
                <Text style={styles.defaultCategoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          {expenseCategories.length === 0 ? (
            <Text style={styles.emptyText}>No expense categories</Text>
          ) : (
            expenseCategories.map((cat) => (
              <View key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{cat.icon || '📝'}</Text>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingCategory(cat);
                      setFormData({
                        name: cat.name,
                        type: cat.type,
                        icon: cat.icon || '📝',
                        color: cat.color || '#6366f1',
                      });
                      setShowForm(true);
                    }}
                  >
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(cat.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income</Text>
          {incomeCategories.length === 0 ? (
            <Text style={styles.emptyText}>No income categories</Text>
          ) : (
            incomeCategories.map((cat) => (
              <View key={cat.id} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{cat.icon || '📝'}</Text>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingCategory(cat);
                      setFormData({
                        name: cat.name,
                        type: cat.type,
                        icon: cat.icon || '📝',
                        color: cat.color || '#6366f1',
                      });
                      setShowForm(true);
                    }}
                  >
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(cat.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  defaultSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  defaultCategoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  defaultCategoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  defaultCategoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  categoryItem: {
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    color: '#6366f1',
    fontWeight: '600',
  },
  deleteButton: {
    color: '#ef4444',
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

