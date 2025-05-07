import React, { useState } from 'react';
import { View, Image, StyleSheet, Modal, TextInput, Button, Text } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';

const MapEditor = ({ route }) => {
  const { mapId, mapImage } = route.params;
  const [pois, setPois] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPoi, setCurrentPoi] = useState(null);
  const [poiName, setPoiName] = useState('');
  const [poiDescription, setPoiDescription] = useState('');

  const handleTap = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPoi = { x: locationX, y: locationY, name: '', description: '' };
    setCurrentPoi(newPoi);
    setModalVisible(true);
  };

  const savePoi = () => {
    if (currentPoi) {
      const updatedPoi = { ...currentPoi, name: poiName, description: poiDescription };
      setPois([...pois, updatedPoi]);
      setModalVisible(false);
      setPoiName('');
      setPoiDescription('');
      setCurrentPoi(null);
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
          <Text style={styles.modalHeader}>Add POI Details</Text>
          <TextInput
            style={styles.input}
            placeholder="POI Name"
            value={poiName}
            onChangeText={setPoiName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={poiDescription}
            onChangeText={setPoiDescription}
            multiline
          />
          <Button title="Save" onPress={savePoi} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    justifyContent: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default MapEditor;
