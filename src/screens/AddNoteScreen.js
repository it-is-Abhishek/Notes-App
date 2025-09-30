import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';



export default function AddNoteScreen({ navigation }) {

  const { addNote } = useContext(NotesContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    const newNote = {
      id: Date.now(),
      title,
      content,
    };
     addNote(newNote);
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 100 }]}
        multiline
      />
      <Button title="Save Note" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input:{
     borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
