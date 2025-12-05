import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { Audio } from 'expo-audio';
import { NotesContext } from '../contexts/NotesContext';

export default function NoteDetailsScreen({ navigation, route }) {
  const { deleteNote } = useContext(NotesContext);

  const note = route.params?.note || route.params?.editNote;

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playAudio = async () => {
    if (!note.audioUri) return;

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: note.audioUri });
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddNote', { editNote: note });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => { deleteNote(note.id); navigation.goBack(); } }
      ]
    );
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>

      {note.content ? (
        <Text style={styles.content}>{note.content}</Text>
      ) : null}

      {note.imageUri ? (
        <View style={styles.imageSection}>
          <Image source={{ uri: note.imageUri }} style={styles.image} />
        </View>
      ) : null}

      {note.audioUri ? (
        <View style={styles.audioSection}>
          <Text style={styles.audioText}>🎙️ Voice Note</Text>
          <Button
            title={isPlaying ? "⏹ Stop" : "▶️ Play"}
            onPress={isPlaying ? stopAudio : playAudio}
          />
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button title="✏️ Edit" onPress={handleEdit} />
        <Button title="🗑️ Delete" onPress={handleDelete} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  content: { fontSize: 16, marginBottom: 20 },
  imageSection: { marginVertical: 20, alignItems: "center" },
  image: { width: 300, height: 200, borderRadius: 10 },
  audioSection: { marginVertical: 20, alignItems: "center" },
  audioText: { fontSize: 18, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", position: "absolute", bottom: 20, left: 20, right: 20 }
});
