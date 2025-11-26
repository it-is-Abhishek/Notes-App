import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const categories = ['Work', 'Study', 'Personal'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Categories</Text>

      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          style={styles.button}
          onPress={() => navigation.navigate('Category', { category: cat })}
        >
          <Text style={styles.text}>{cat}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, {backgroundColor: "#4A90E2"}]}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Text style={styles.text}>➕ Add General Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  button: { padding: 15, backgroundColor: "#e59f9f", borderRadius: 12, marginVertical: 8, width: "90%", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold", color: "#fff" }
});
