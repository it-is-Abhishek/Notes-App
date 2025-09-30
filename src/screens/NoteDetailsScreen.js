import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';

export default function NoteDetailScreen({ route, navigation }) {
  const { note } = route.params;
  const { deleteNote } = useContext(NotesContext);

  const handleDelete = () => {
    deleteNote(note.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text>{note.content}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="Edit Note"
          onPress={() => navigation.navigate('AddNote', { editNote: note })}
        />
        <Button title="Delete Note" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
});
