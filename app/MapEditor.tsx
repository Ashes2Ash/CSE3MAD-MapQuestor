import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import POIDetailsModal from './POIDetailsModal';

const MapEditor = () => {
  const { mapId } = useLocalSearchParams();
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('maps')
      .doc(mapId)
      .collection('pois')
      .onSnapshot((snapshot) => {
        const poiList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPois(poiList);
      }, (error) => {
        console.error('Error fetching POIs:', error);
      });

    return () => unsubscribe();
  }, [mapId]);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    const newPOI = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: '',
      description: '',
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    const poiRef = await firestore()
      .collection('maps')
      .doc(mapId)
      .collection('pois')
      .add(newPOI);
    setSelectedPOI({ id: poiRef.id, ...newPOI });
    setModalVisible(true);
  };

  const handleSaveMap = async () => {
    Alert.alert('Map Saved', 'Map has been saved successfully');
  };

  const handleDeletePOI = async (poiId) => {
    await firestore().collection('maps').doc(mapId).collection('pois').doc(poiId).delete();
  };

  const handleSharePOI = (poi) => {
    Alert.alert('Share', `Sharing POI: ${poi.name}`);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            onPress={() => {
              setSelectedPOI(poi);
              setModalVisible(true);
            }}
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMap}>
        <Text>Save Map</Text>
      </TouchableOpacity>
      <View style={styles.bottomNav}>
        <TouchableOpacity><Text>My Map</Text></TouchableOpacity>
        <TouchableOpacity><Text>Edit</Text></TouchableOpacity>
        <TouchableOpacity><Text>Points of Interest</Text></TouchableOpacity>
        <TouchableOpacity><Text>Home</Text></TouchableOpacity>
      </View>
      <POIDetailsModal
        visible={modalVisible}
        poi={selectedPOI}
        onSave={(data) => {
          firestore().collection('maps').doc(mapId).collection('pois').doc(selectedPOI.id).update(data);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
        onDelete={() => handleDeletePOI(selectedPOI.id)}
        onShare={() => handleSharePOI(selectedPOI)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  saveButton: { position: 'absolute', top: 10, right: 10, padding: 10, backgroundColor: '#ddd' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' },
});

export default MapEditor;
