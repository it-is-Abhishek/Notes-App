import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';

export default function CategoryManagementScreen({ navigation }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(NotesContext);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditText(category);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== editingCategory) {
      updateCategory(editingCategory, editText.trim());
    }
    setEditingCategory(null);
    setEditText('');
  };

  const handleDeleteCategory = (category) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category}"? All notes in this category will also be deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteCategory(category) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>

      <View style={styles.addContainer}>
        <TextInput
          placeholder="New category name"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
        />
        <Button title="Add" onPress={handleAddCategory} />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            {editingCategory === item ? (
              <View style={styles.editContainer}>
                <TextInput
                  value={editText}
                  onChangeText={setEditText}
                  style={styles.input}
                />
                <Button title="Save" onPress={handleSaveEdit} />
                <Button title="Cancel" onPress={() => setEditingCategory(null)} />
              </View>
            ) : (
              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>{item}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleEditCategory(item)} style={styles.editBtn}>
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCategory(item)} style={styles.deleteBtn}>
                    <Text style={styles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />

      <Button title="Done" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  addContainer: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6, marginRight: 10 },
  categoryItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  categoryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryText: { fontSize: 18 },
  buttonRow: { flexDirection: "row" },
  editBtn: { backgroundColor: "#007bff", padding: 8, borderRadius: 4, marginRight: 10 },
  deleteBtn: { backgroundColor: "#dc3545", padding: 8, borderRadius: 4 },
  btnText: { color: "#fff", fontWeight: "bold" },
  editContainer: { flexDirection: "row", alignItems: "center" }
});
