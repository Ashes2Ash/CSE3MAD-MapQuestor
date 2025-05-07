import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { GoogleMap, Marker as GoogleMarker, LoadScript } from '@react-google-maps/api';
import { db, savePOIWithImage } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const MapEditor = ({ route }) => {
  const { mapId } = route.params;
  const [mapData, setMapData] = useState(null);
  const [pois, setPois] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const mapRef = doc(db, 'maps', mapId);
        const mapSnap = await getDoc(mapRef);
        if (mapSnap.exists()) {
          setMapData(mapSnap.data());
        }
      } catch (error) {
        console.error('Error fetching map data: ', error);
      }
    };

    fetchMapData();
  }, [mapId]);

  const handleMapPress = (e) => {
    const coordinate = Platform.OS === 'web' ? 
      { latitude: e.latLng.lat(), longitude: e.latLng.lng() } : 
      e.nativeEvent.coordinate;
    const newPoi = {
      coordinate,
      name: '',
      description: '',
    };
    setPois([...pois, newPoi]);
    setSelectedPoi(newPoi);
    setModalVisible(true);
  };

  const handleMarkerPress = (poi) => {
    setSelectedPoi(poi);
    setModalVisible(true);
  };

  const handleSavePois = async () => {
    try {
      for (const poi of pois) {
        const poiData = {
          mapId: mapId,
          latitude: poi.coordinate.latitude,
          longitude: poi.coordinate.longitude,
          name: poi.name || 'Unnamed POI',
          description: poi.description || '',
        };
        await savePOIWithImage(poiData, null); // No image for now
      }
      Alert.alert('Success', 'POIs saved successfully!');
    } catch (error) {
      console.error('Error saving POIs: ', error);
      Alert.alert('Error', 'Failed to save POIs.');
    }
  };

  if (!mapData) {
    return <Text>Loading map...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Map Editor</Text>
      {Platform.OS === 'web' ? (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: mapData.latitude || 37.78825,
              lng: mapData.longitude || -122.4324,
            }}
            zoom={10}
            onClick={handleMapPress}
          >
            {pois.map((poi, index) => (
              <GoogleMarker
                key={index}
                position={{
                  lat: poi.coordinate.latitude,
                  lng: poi.coordinate.longitude,
                }}
                title={poi.name || 'Unnamed POI'}
                onClick={() => handleMarkerPress(poi)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: mapData.latitude || 37.78825,
            longitude: mapData.longitude || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {pois.map((poi, index) => (
            <Marker
              key={index}
              coordinate={poi.coordinate}
              title={poi.name || 'Unnamed POI'}
              description={poi.description}
              onPress={() => handleMarkerPress(poi)}
            />
          ))}
        </MapView>
      )}
      <Button title="Save POIs" onPress={handleSavePois} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>POI Details</Text>
            <TextInput
              style={styles.input}
              placeholder="POI Name"
              value={selectedPoi?.name}
              onChangeText={(text) => {
                const updatedPoi = { ...selectedPoi, name: text };
                setSelectedPoi(updatedPoi);
                const updatedPois = pois.map((p) =>
                  p.coordinate === selectedPoi.coordinate ? updatedPoi : p
                );
                setPois(updatedPois);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={selectedPoi?.description}
              onChangeText={(text) => {
                const updatedPoi = { ...selectedPoi, description: text };
                setSelectedPoi(updatedPoi);
                const updatedPois = pois.map((p) =>
                  p.coordinate === selectedPoi.coordinate ? updatedPoi : p
                );
                setPois(updatedPois);
              }}
              multiline
            />
            <Button
              title="Save"
              onPress={() => setModalVisible(false)}
            />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
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
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
