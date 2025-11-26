import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import AddNoteScreen from './src/screens/AddNoteScreen';
import NoteDetailsScreen from './src/screens/NoteDetailsScreen';

import { NotesProvider } from './src/contexts/NotesContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NotesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="AddNote" component={AddNoteScreen} />
          <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NotesProvider>
  );
}
