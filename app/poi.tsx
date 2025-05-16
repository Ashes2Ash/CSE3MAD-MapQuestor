import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { savePOIWithImage } from '../firebaseConfig';

const POIScreen: React.FC = () => {
  const [poiName, setPoiName] = useState<string>('');
  const [poiDescription, setPoiDescription] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSavePOI = async () => {
    if (!poiName || !poiDescription || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and upload an image.');
      return;
    }
    try {
      await savePOIWithImage({
        name: poiName,
        description: poiDescription,
        imageUri,
        mapId: 'sampleMapId', // Replace with dynamic mapId from context
      });
      Alert.alert('Success', 'POI saved successfully!');
      router.push('/map-editor'); // Navigate back to Map Editor
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Point of Interest</Text>
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
      <Button title="Upload Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Save POI" onPress={handleSavePOI} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default POIScreen;
