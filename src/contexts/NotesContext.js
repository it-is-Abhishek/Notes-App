import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Load notes on app start
  useEffect(() => {
    const loadNotes = async () => {
      const stored = await AsyncStorage.getItem("NOTES_APP_DATA");
      if (stored) setNotes(JSON.parse(stored));
    };
    loadNotes();
  }, []);

  // Save notes whenever updated
  useEffect(() => {
    AsyncStorage.setItem("NOTES_APP_DATA", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes(prev => [...prev, note]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
