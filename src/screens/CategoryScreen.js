import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';

export default function CategoryScreen({ route, navigation }) {
  const category = route.params?.category;
  const { notes } = useContext(NotesContext);

  const filtered = notes.filter(n => n.category === category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂 {category} Notes</Text>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>No notes here yet 🥲</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('NoteDetails', { note: item })}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>

              {item.audioUri ? (
                <Text style={{color: "green"}}>🎧 Voice Note Available</Text>
              ) : (
                <Text numberOfLines={1}>{item.content}</Text>
              )}

            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddNote', { category })}
      >
        <Text style={styles.addText}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 14 },
  empty: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },
  card: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  addBtn: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 16 },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 18 }
});
