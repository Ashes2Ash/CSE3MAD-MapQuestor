import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Map Selection</Text>
      {maps.length === 0 ? (
        <Text style={styles.noMapsText}>No maps found.</Text>
      ) : null}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/mapConfig')}
      >
        <Text style={styles.createButtonText}>Create New Map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  noMapsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapSelector;
