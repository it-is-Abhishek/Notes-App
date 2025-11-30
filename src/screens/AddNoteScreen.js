import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-audio';
import { NotesContext } from '../contexts/NotesContext';

export default function AddNoteScreen({ navigation, route }) {
  const { addNote, updateNote, categories } = useContext(NotesContext);

  const editNote = route.params?.editNote;
  const category = route.params?.category || editNote?.category || (categories.length > 0 ? categories[0] : null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setAudioUri(editNote.audioUri || null);
    }
  }, []);

  const startRecording = async () => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed!", "Allow mic access 🎤");
      return;
    }

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const stopRecording = async () => {
    await recording.stopAndUnloadAsync();
    setAudioUri(recording.getURI());
    setRecording(null);
  };

  const handleSave = () => {
    if (!title.trim() && !audioUri) {
      Alert.alert("Wait!", "Add title or record voice!");
      return;
    }

    const noteObj = {
      id: editNote ? editNote.id : Date.now(),
      title: title.trim() || "🎙️ Voice Note",
      content,
      category,
      audioUri,
    };

    if (editNote) updateNote(editNote.id, noteObj);
    else addNote(noteObj);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title (optional if voice)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Write something..."
        value={content}
        onChangeText={setContent}
        style={[styles.input, {height: 80}]}
        multiline
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.label}>Category:</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryBtn,
              category === cat && styles.categoryBtnSelected,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{marginVertical: 10}}>
        {recording ? (
          <Button title="⏹ Stop Recording" onPress={stopRecording} />
        ) : (
          <Button title="🎙 Record Voice Note" onPress={startRecording} />
        )}
      </View>

      {audioUri && <Text style={{textAlign: "center", color: "green"}}>✅ Voice added!</Text>}

      <Button title="💾 Save Note" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6, marginBottom: 10 },
  categoryContainer: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  categoryBtn: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, marginRight: 10, marginBottom: 5 },
  categoryBtnSelected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  categoryText: { fontSize: 16 },
  categoryTextSelected: { color: "#fff" }
});
