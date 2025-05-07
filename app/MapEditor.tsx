import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Modal, TextInput, Button, Text } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const MapEditor = ({ route }) => {
  const { mapId, mapImage } = route.params;
  const [pois, setPois] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPoi, setCurrentPoi] = useState(null);
  const [poiName, setPoiName] = useState('');
  const [poiDescription, setPoiDescription] = useState('');

  useEffect(() => {
    const fetchPois = async () => {
      try {
        const poisCollection = collection(db, `maps/${mapId}/pois`);
        const poisSnapshot = await getDocs(poisCollection);
        const poisList = poisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPois(poisList);
      } catch (error) {
        console.error('Error fetching POIs:', error);
      }
    };

    fetchPois();
  }, [mapId]);

  const handleTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPoi = { x: locationX, y: locationY, name: '', description: '' };
    setCurrentPoi(newPoi);
    setModalVisible(true);
  };

  const savePoi = async () => {
    if (currentPoi) {
      const updatedPoi = { ...currentPoi, name: poiName, description: poiDescription };
      try {
        const poisCollection = collection(db, `maps/${mapId}/pois`);
        await addDoc(poisCollection, updatedPoi);
        setPois([...pois, updatedPoi]);
        setModalVisible(false);
        setPoiName('');
        setPoiDescription('');
        setCurrentPoi(null);
      } catch (error) {
        console.error('Error saving POI:', error);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Map Editor</Text>
      <TapGestureHandler onHandlerStateChange={handleTap}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: mapImage }} style={styles.mapImage} />
          {pois.map((poi, index) => (
            <View
              key={index}
              style={[styles.poiMarker, { left: poi.x - 5, top: poi.y - 5 }]}
            />
          ))}
        </View>
      </TapGestureHandler>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Point of Interest</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={poiName}
            onChangeText={setPoiName}
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            value={poiDescription}
            onChangeText={setPoiDescription}
            multiline
          />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={savePoi} color="#007AFF" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3B30" />
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  poiMarker: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default MapEditor;
