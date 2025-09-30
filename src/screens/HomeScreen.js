import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function HomeScreen( {navigation} ) {

  const categories = ['   Work   ', '   Study   ', ' Personal ']


  return (
  <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Category', { category })}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 18,
    color: '#fff',
  }
});
