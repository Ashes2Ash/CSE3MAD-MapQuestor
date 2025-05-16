import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import POIDetailsModal from './POIDetailsModal';
import { auth } from '../firebaseConfig';

const MapEditor = () => {
  const { mapId } = useLocalSearchParams();
  const [mapData, setMapData] = useState(null);
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;

    // First, try to fetch from user-specific maps
    const userMapRef = firestore().collection(`users/${uid}/maps`).doc(mapId);
    userMapRef.get().then((doc) => {
      if (doc.exists) {
        setMapData(doc.data());
        fetchPOIs(userMapRef);
      } else {
        // If not found in user maps, try shared maps
        const sharedMapRef = firestore().collection('maps').doc(mapId);
        sharedMapRef.get().then((sharedDoc) => {
          if (sharedDoc.exists) {
            setMapData(sharedDoc.data());
            fetchPOIs(sharedMapRef);
          } else {
            console.error('Map not found');
          }
        });
      }
    });
  }, [mapId]);

  const fetchPOIs = (mapRef) => {
    const unsubscribe = mapRef.collection('pois').onSnapshot(
      (snapshot) => {
        const poiList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPois(poiList);
      },
      (error) => {
        console.error('Error fetching POIs:', error);
      }
    );
    return unsubscribe;
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    const newPOI = {
      x: coordinate.x, // Adjust based on your image coordinates
      y: coordinate.y,
      name: '',
      description: '',
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    const user = auth.currentUser;
    const uid = user.uid;
    const mapRef = firestore()
      .collection(mapData?.isShared ? 'maps' : `users/${uid}/maps`)
      .doc(mapId);
    const poiRef = await mapRef.collection('pois').add(newPOI);
    setSelectedPOI({ id: poiRef.id, ...newPOI });
    setModalVisible(true);
  };

  const handleSaveMap = async () => {
    Alert.alert('Map Saved', 'Map has been saved successfully');
  };

  const handleDeletePOI = async (poiId) => {
    const user = auth.currentUser;
    const uid = user.uid;
    const mapRef = firestore()
      .collection(mapData?.isShared ? 'maps' : `users/${uid}/maps`)
      .doc(mapId);
    await mapRef.collection('pois').doc(poiId).delete();
  };

  const handleSharePOI = (poi) => {
    Alert.alert('Share', `Sharing POI: ${poi.name}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text>←</Text>
      </TouchableOpacity>
      {mapData?.imageURL ? (
        <ScrollView
          style={styles.mapContainer}
          contentContainerStyle={{ position: 'relative' }}
          onTouchEnd={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            handleMapPress({
              nativeEvent: { coordinate: { x: locationX, y: locationY } },
            });
          }}
        >
          <Image
            source={{ uri: mapData.imageURL }}
            style={styles.mapImage}
            resizeMode="contain"
          />
          {pois.map((poi) => (
            <TouchableOpacity
              key={poi.id}
              style={[styles.poiMarker, { left: poi.x, top: poi.y }]}
              onPress={() => {
                setSelectedPOI(poi);
                setModalVisible(true);
              }}
            >
              <Text>{poi.name || 'POI'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text>Loading map...</Text>
      )}
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
          const user = auth.currentUser;
          const uid = user.uid;
          firestore()
            .collection(mapData?.isShared ? 'maps' : `users/${uid}/maps`)
            .doc(mapId)
            .collection('pois')
            .doc(selectedPOI.id)
            .update(data);
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
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 10, left: 10, padding: 10, zIndex: 1 },
  mapContainer: { flex: 1 },
  mapImage: { width: '100%', height: 300 },
  poiMarker: { position: 'absolute', backgroundColor: 'rgba(255, 0, 0, 0.5)', padding: 5, borderRadius: 5 },
  saveButton: { position: 'absolute', top: 10, right: 10, padding: 10, backgroundColor: '#ddd' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' },
});

export default MapEditor;
