import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { db, saveMapWithImage } from '../firebaseConfig';

const MapConfig = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scale, setScale] = useState<string>('1:1000'); // Default scale
  const scales = ['1:1000', '1:5000', '1:10000']; // Available scale options

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

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const saveMap = async () => {
    if (!imageUri || !scale) {
      Alert.alert('Error', 'Please upload an image and select a scale.');
      return;
    }

    try {
      const blob = await uriToBlob(imageUri);
      const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      await saveMapWithImage({ scale }, blob, fileName);
      Alert.alert('Success', 'Map saved successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Create New Map</Text>
      
      <Text style={styles.label}>Upload Image</Text>
      <TouchableOpacity style={styles.input} onPress={pickImage}>
        <Text>{imageUri ? 'Image selected' : 'Select Image'}</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.label}>Scale</Text>
      <View style={styles.scaleContainer}>
        {scales.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.scaleOption, scale === s && styles.selectedScale]}
            onPress={() => setScale(s)}
          >
            <Text style={styles.scaleText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveMap}>
        <Text style={styles.saveButtonText}>Save Map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scaleOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedScale: {
    backgroundColor: '#007AFF',
  },
  scaleText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapConfig;
