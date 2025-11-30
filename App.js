import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import AddNoteScreen from './src/screens/AddNoteScreen';
import NoteDetailsScreen from './src/screens/NoteDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import CategoryManagementScreen from './src/screens/CategoryManagementScreen';
import LoadingScreen from './src/components/LoadingScreen';

import { NotesProvider } from './src/contexts/NotesContext';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoading, logout } = useContext(AuthContext);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
                    <MaterialIcons name="logout" size={24} color="#333" />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="AddNote" component={AddNoteScreen} />
            <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppNavigator />
      </NotesProvider>
    </AuthProvider>
  );
}
