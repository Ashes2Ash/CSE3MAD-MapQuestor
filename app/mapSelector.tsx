import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const MapSelector = () => {
  const navigation = useNavigation();
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const mapsCollection = collection(db, 'maps');
        const mapsSnapshot = await getDocs(mapsCollection);
        const mapsList = mapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMaps(mapsList);
      } catch (error) {
        console.error('Error fetching maps:', error);
      }
    };

    fetchMaps();
  }, []);

  const renderMapItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mapItem}
      onPress={() => navigation.navigate('MapEditor', { mapId: item.id, mapImage: item.imageUrl })}
    >
      <Text style={styles.mapTitle}>{item.name}</Text>
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
        style={styles.createButton}
        onPress={() => navigation.navigate('MapConfig')}
      >
        <Text style={styles.createButtonText}>Create New Map</Text>
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
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapSelector;
