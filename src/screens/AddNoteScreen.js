import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { NotesContext } from '../contexts/NotesContext';

export default function AddNoteScreen({ navigation, route }) {
  const { addNote, updateNote, categories } = useContext(NotesContext);

  const editNote = route.params?.editNote;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState(route.params?.category || editNote?.category || (categories.length > 0 ? categories[0] : null));

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setAudioUri(editNote.audioUri || null);
      setImageUri(editNote.imageUri || null);
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

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed!", "Allow access to photos 📸");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop();
      const newUri = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });
      setImageUri(newUri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed!", "Allow camera access 📷");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop();
      const newUri = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });
      setImageUri(newUri);
    }
  };

  const handleSave = () => {
    if (!title.trim() && !audioUri && !imageUri) {
      Alert.alert("Wait!", "Add title, record voice, or take a photo!");
      return;
    }

    const noteObj = {
      id: editNote ? editNote.id : Date.now(),
      title: title.trim() || (audioUri ? "🎙️ Voice Note" : "📷 Photo Note"),
      content,
      category,
      audioUri,
      imageUri,
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
        <TouchableOpacity
          style={[styles.actionButton, recording && styles.recordingButton]}
          onPress={recording ? stopRecording : startRecording}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, recording && styles.recordingText]}>
            {recording ? "⏹ Stop Recording" : "🎙 Record Voice Note"}
          </Text>
        </TouchableOpacity>
      </View>

      {audioUri && <Text style={{textAlign: "center", color: "green"}}>✅ Voice added!</Text>}

      <View style={{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-around'}}>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={takePhoto}
          activeOpacity={0.7}
        >
          <Text style={styles.mediaButtonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <Text style={styles.mediaButtonText}>🖼️ Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Text style={{textAlign: "center", color: "green"}}>✅ Image added!</Text>}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.7}
      >
        <Text style={styles.saveButtonText}>💾 Save Note</Text>
      </TouchableOpacity>
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
  categoryTextSelected: { color: "#fff" },
  actionButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recordingText: {
    color: "#fff",
  },
  mediaButton: {
    backgroundColor: "#17a2b8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    minWidth: 120,
  },
  mediaButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
