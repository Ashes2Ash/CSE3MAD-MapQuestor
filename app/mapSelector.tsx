import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Use Expo Router for navigation
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const MapSelector = () => {
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const mapsCollection = collection(db, 'maps');
        const mapsSnapshot = await getDocs(mapsCollection);
        const mapsList = mapsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMaps(mapsList);
      } catch (error) {
        console.error('Error fetching maps: ', error);
      }
    };

    fetchMaps();
  }, []);

  const renderMapItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mapItem}
      onPress={() => router.push({ pathname: '/mapEditor', params: { mapId: item.id } })}
    >
      <Text style={styles.mapTitle}>{item.name || 'Unnamed Map'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Map Selection</Text>
      <FlatList
        data={maps}
        renderItem={renderMapItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No maps found.</Text>}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/mapConfig')}
      >
        <Text style={styles.buttonText}>Create New Map</Text>
      </TouchableOpacity>
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
  mapItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mapTitle: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapSelector;
