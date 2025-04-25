import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Expo Router navigation object for screen transitions
import { router } from 'expo-router';
export default function mapSelector() {
  return (
    <View style={styles.screen}>
  <View style={styles.title}>
    <Text>Select a map to edit!</Text>
  </View>

  <View style={styles.container}>
    <Text>place map tiles here</Text>
  </View>
  <View>
    <TouchableOpacity style={styles.testButton} onPress={() => router.push('/uploadMap')}>
            <Text>Upload New Map</Text>
          </TouchableOpacity>
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightgray',
    width: '100%'
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  screen:{
    flex:1,
    backgroundColor: '#fff'
  },
  testButton: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#50546B',
    width: '50%',
    height: 30,
    marginTop: 12
  }
});
