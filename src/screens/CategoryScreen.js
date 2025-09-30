import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NotesContext } from '../contexts/NotesContext';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const { notes } = useContext(NotesContext);

  const categoryNotes = notes.filter((note) => note.category === category);

  return (
    <View>
      <Text>This is CategoryScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,

  }
})

