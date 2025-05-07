import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, Modal, TextInput, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleMap, Marker as GoogleMarker, LoadScript } from '@react-google-maps/api';
import { db, auth, savePOIWithImage } from '../firebaseConfig';
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
        console.log('Fetching map data for mapId:', mapId);
        const mapRef = doc(db, 'maps', mapId);
        const mapSnap = await getDoc(mapRef);
        if (mapSnap.exists()) {
          setMapData(mapSnap.data());
          console.log('Map data fetched:', mapSnap.data());
        } else {
          console.log('Map not found for mapId:', mapId);
          Alert.alert('Error', 'Map not found.');
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
        Alert.alert('Error', 'Failed to fetch map data.');
      }
    };

    fetchMapData();
  }, [mapId]);

  const handleMapPress = (e) => {
    const coordinate = Platform.OS === 'web' 
      ? { latitude: e.latLng.lat(), longitude: e.latLng.lng() } 
      : e.nativeEvent.coordinate;
    const newPoi = {
      coordinate,
      name: '',
      description: '',
      imageUri: null,
    };
    setPois([...pois, newPoi]);
    setSelectedPoi(newPoi);
    setModalVisible(true);
    console.log('New POI added:', newPoi);
  };

  const handleMarkerPress = (poi) => {
    setSelectedPoi(poi);
    setModalVisible(true);
    console.log('Marker pressed:', poi);
  };

  const pickImage = async () => {
    try {
      console.log('Requesting media library permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permissions denied.');
        Alert.alert('Permission Denied', 'Camera roll access is required to select an image.');
        return;
      }

      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        console.log('Image selected:', selectedImage.uri);
        setSelectedPoi(prev => ({ ...prev, imageUri: selectedImage.uri }));
        const updatedPois = pois.map(p => 
          p.coordinate === selectedPoi.coordinate ? { ...p, imageUri: selectedImage.uri } : p
        );
        setPois(updatedPois);
      } else {
        console.log('Image selection canceled or no image selected.');
        Alert.alert('No Image Selected', 'Please select an image.');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image.');
    }
  };

  const handleSavePois = async () => {
    try {
      console.log('Saving POIs:', pois);
      if (!auth.currentUser) {
        console.log('No user logged in.');
        Alert.alert('Error', 'You must be logged in to save POIs.');
        return;
      }
      console.log('User authenticated:', auth.currentUser.uid);

      for (const poi of pois) {
        let imageBlob = null;
        if (Platform.OS !== 'web' && poi.imageUri) {
          console.log('Fetching image from URI:', poi.imageUri);
          const response = await fetch(poi.imageUri);
          console.log('Converting image to Blob...');
          imageBlob = await response.blob();
        }
        const poiData = {
          mapId: mapId,
          latitude: poi.coordinate.latitude,
          longitude: poi.coordinate.longitude,
          name: poi.name || 'Unnamed POI',
          description: poi.description || '',
        };
        console.log('Saving POI:', poiData);
        await savePOIWithImage(poiData, imageBlob);
        console.log('POI saved successfully.');
      }
      Alert.alert('Success', 'POIs saved successfully!');
    } catch (error) {
      console.error('Error saving POIs:', error);
      Alert.alert('Error', `Failed to save POIs: ${error.message}`);
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
            {Platform.OS !== 'web' && <Button title="Upload Image" onPress={pickImage} />}
            {Platform.OS !== 'web' && selectedPoi?.imageUri && (
              <Image source={{ uri: selectedPoi.imageUri }} style={{ width: 100, height: 100, marginBottom: 10 }} />
            )}
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
