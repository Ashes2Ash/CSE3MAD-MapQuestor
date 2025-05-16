import React, {FC} from 'react'; //Imports react and Function Component
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'; //Imports building blocks for screen
import {useState,useEffect} from 'react'; //useState stores states of data. used in this to hold map lists from firebase. useEffect runs side loaded scripts at specific times 
import {auth,db} from '../firebaseConfig'; //auth allows us to confirm which user is logged in, db links to our firestore
import { router } from 'expo-router'; //redirects to other page in app
import {collection, getDocs} from 'firebase/firestore'; //allows us to explore data collections and documents stored in firebase storage, used here to get map links for the tiles.
import { ScrollView } from 'react-native'

//Lists properties of a MapTile which is made up fo the image uri (link to image), title of map (user provided name of map), and what to do on click. The Key prop refers to an internal identifier that typically doesnt need to be declared but due to strict rules on Typescript i have done so.
interface MapTileProps {
  uri:     string;
  title:   string;
  onPress: () => void;
  key?: React.Key;
}
type MapGridProps={
  children: React.ReactElement[] | React.ReactElement
}
//Reusable component (FC: Functional Component), made up of the above properties that is looped through below to list out each map attached to the user in a grid.
const MapTile: FC<MapTileProps> =({uri, onPress,title})=>{
  return(
    <TouchableOpacity onPress={onPress}>
      <Image
      source={{uri}}
      style={{ width: 100, height: 100}}
      ></Image>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}
function MapGrid({children}: MapGridProps): JSX.Element{
  const userMaps=Array.isArray(children) ? children:[children]
  return(
    <View style={styles.grid}>
      {userMaps.map((child, i)=>(
        <View style={styles.tile} key={i}>
          {child}
        </View>
      ))}
    </View>
);

}
export default function mapSelector() {
  //defines the maps array that holds the users map list. the setMaps function that is called to update the array
  const [maps, setMaps]= useState([]as {
    id: string;
    uri: string;
    title: string;
    onPress: () => void;
    }[]);
    //useEffect side loads data once, right after the screen loads.
  useEffect(()=>{
    async function getMaps(){
      //confirms user is signed in and retreives their uid (userId)
      const user= auth.currentUser;
      if(!user){
        return
      }
      const uid=user.uid
      console.log(user)
      //uses the uid to search for that users maps in the firestore collection at the path db/users/{uid}/maps
      const mapCollection = collection(db,"users/"+uid+"/maps/")
      //gets all of the users map data into a snapshot
      const snapshot=await getDocs(mapCollection);
      //logs map totals tied to user (for testing)
      console.log("Number of maps on account: "+snapshot.size)
      //converts each map document into a js object and pushes each object to the below mapList array
      const mapList=[]
      for(let docSnap of snapshot.docs){
        let data= docSnap.data()
        console.log(data)
        mapList.push({
          id:       docSnap.id,
          uri:      data.imageURL,
          title:    data.title,

          onPress: () => console.log("Tapped", docSnap.id) //Just alerts console that tap has been registered, (UPDATE TO REDIRECT TO mapEditor.tsx)
        })
        
      }
      //sets the maps State variable as the received mapList
      setMaps(mapList)
    }
    //calls the getMaps() useEffect function when the page is loaded.
    getMaps()
  },[]);// the [] means there are no dependencies, so the useEffect code runs only once when the component is first loaded.
  
  
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.title}>
          <Text>Select a map to edit!</Text>
        </View>
        <MapGrid>
          {maps.map(item => (
            <MapTile
              key={item.id}
              uri={item.uri}
              onPress={item.onPress}
              title={item.title}
            />
          ))}
        </MapGrid>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={() => router.push('/uploadMap')}>
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
  uploadButton: {
    justifyContent:'center',
    alignContent:'center',
    backgroundColor:'#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 150,
    height: 30,
    marginTop: 6
  },
  uploadButtonText:{
    textAlign:'center'
  },
  grid:{
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'flex-start',
    padding: 2
  },
  tile:{
    justifyContent:'center',
    alignItems:'center',
    width:'23%',
    margin: '1%'
  },
  buttonContainer:{
    justifyContent:'center',
    alignItems:'center',
    position: 'absolute',
    bottom:0,
    left:0,
    right:0,
    height:58,
    backgroundColor:"#fff",
    zIndex:1, //keeps on top of scroll content
    shadowColor:'#000', //This and following styles apply small shadow to floating button container
    shadowOffset:{width:0,height:-2},
    shadowOpacity:0.15,
    shadowRadius:4,
    elevation:8
  },
  scrollContent:{
    paddingBottom: 80
  }
});
