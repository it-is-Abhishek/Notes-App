import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const { notes } = useContext(NotesContext);

  const categoryNotes = notes.filter((note) => note.category === category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Notes</Text>

      {categoryNotes.length === 0 ? (
        <Text style={styles.emptyText}>No notes yet. Add one!</Text>
      ) : (
        <FlatList
          data={categoryNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.noteCard}
              onPress={() => navigation.navigate('NoteDetails', { note: item })}
            >
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent} numberOfLines={1}>
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNote', { category })}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  noteCard: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
