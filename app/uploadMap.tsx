import { View, Text, StyleSheet, Image, TouchableOpacity,TextInput } from 'react-native';
// Expo Router navigation object for screen transitions
import { router } from 'expo-router';
// Expo image picker to allow for uplaoding map images
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';



export default function ScreenName() {
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
  return (
    <View style={styles.screen}>
        <Text>Upload Map</Text>
        <View>
          <TextInput  style={styles.input}
                      placeholder="Enter map title"
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
                
                <TouchableOpacity onPress={() => mapSelect()} style={styles.testButton}>
                <Text>Upload Image to use as Map!</Text></TouchableOpacity>

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
    backgroundColor: '#fff', // Optional: clean light background
  },
  screen:{
    flex:1,
    backgroundColor: '#fff'
  },
  testButton: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#50546B',
    width: '90%',
    height: 30,
    marginTop: 12
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  }
  
});
