import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapConfig = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Map Config</Text>
      <Text>Configure your map here (to be implemented).</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default MapConfig;
