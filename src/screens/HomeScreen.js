import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function HomeScreen( {navigation} ) {

  const categories = ['Work', 'Study', 'Personal']


  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {categories.map((category) => )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
