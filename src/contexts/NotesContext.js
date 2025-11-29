
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const NotesContext = createContext();


export const NotesProvider = ({ children }) => {

  const [notes, setNotes] = useState([]);


  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("NOTES_APP_DATA");
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);


  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem("NOTES_APP_DATA", JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };
    saveNotes();
  }, [notes]);


  const addNote = (note) => {
    setNotes(prevNotes => [...prevNotes, note]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes(prevNotes => prevNotes.map(note => note.id === id ? updatedNote : note));
  };

  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };


  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
