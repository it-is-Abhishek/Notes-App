
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const NotesContext = createContext();


export const NotesProvider = ({ children }) => {

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Work', 'Study', 'Personal']);


  useEffect(() => {
    const loadData = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("NOTES_APP_DATA");
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
        const storedCategories = await AsyncStorage.getItem("NOTES_APP_CATEGORIES");
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
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

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prevCategories => [...prevCategories, category]);
    }
  };

  const updateCategory = (oldCategory, newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories(prevCategories => prevCategories.map(cat => cat === oldCategory ? newCategory : cat));
      setNotes(prevNotes => prevNotes.map(note => note.category === oldCategory ? { ...note, category: newCategory } : note));
    }
  };

  const deleteCategory = (category) => {
    setCategories(prevCategories => prevCategories.filter(cat => cat !== category));
    setNotes(prevNotes => prevNotes.filter(note => note.category !== category));
  };


  return (
    <NotesContext.Provider value={{ notes, categories, addNote, updateNote, deleteNote, addCategory, updateCategory, deleteCategory }}>
      {children}
    </NotesContext.Provider>
  );
};
