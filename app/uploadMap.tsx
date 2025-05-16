import { View, Text, StyleSheet, Image, TouchableOpacity,TextInput } from 'react-native';
// Expo Router navigation object for screen transitions
import { router } from 'expo-router';
// Expo image picker to allow for uplaoding map images
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';


export default function ScreenName() {
  const [error,setError]=useState('');
  const [map,setMap] = useState<string | null>(null);
  const mapSelect = async () => {
      const permission= await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(!permission.granted){
          return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.5
      });
      if (result.canceled){
          return
      }else{
          setMap(result.assets[0].uri)
      }
  };
  const [mapName,setMapName]=useState('');
  const mapUpload = async (localUri:string,title:string) =>{
    const storage= getStorage();
    const user = auth.currentUser;

    if(!user){
      console.log('No user logged in')
      return;
    }
    const response = await fetch(localUri)
    const blob = await response.blob();
    //console.log(blob)
    const fileName = `${user.uid}_${new Date().toISOString()}.jpg`
    const storageRef = ref(storage,`maps/${user.uid}/${fileName}`);
    //console.log(storageRef)
    await uploadBytes(storageRef, blob)
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL)
    await addDoc(collection(db, 'users', user.uid, 'maps'), {
      title: title,
      imageURL: downloadURL,
      createdAt: serverTimestamp(),
    });
    console.log('Map uploaded and saved successfully!');
    router.push('/mapSelector')
  }
return (
  <View style={styles.screen}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
      <Text style={styles.title}>Create a New Map to edit</Text>
      <View>
        <TextInput  style={styles.mapNameInput}
                    placeholder="Enter a name for your map!"
                    value={mapName}
                    onChangeText={setMapName}></TextInput>
      </View>
      <View style={styles.container}>
          {map && (
              <Image
                  source={{ uri: map }}
                  style={{ width: 200, height: 200 }}
              />
          )}
          <View>
              {error !== '' ? (<Text style={styles.errorText}>{error}</Text>) : null}
              <TouchableOpacity onPress={() => mapSelect()} style={styles.uploadButton}>
              <Text>Upload Image to use as Map!</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (!map) {
                  console.log('Please select an image first.');
                  setError('Please select an image first.')
                  return;
                }
                if (!mapName.trim()) {
                  console.log('Please enter a map title.');
                  setError('Please enter a name for your map.')
                  return;
                }
                mapUpload(map,mapName)}}
                style={styles.uploadButton}>
              <Text>Create Map!</Text></TouchableOpacity>
          </View>
      </View>
      
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  screen:{
    flex:1,
    backgroundColor: '#fff',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    fontSize:26
  },
  uploadButton: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#007AFF',
    minWidth:200,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  errorText:{
    color:'red',
  },
  mapNameInput: {
    width: '106%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
    marginTop:20
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
  }
  
  
});
