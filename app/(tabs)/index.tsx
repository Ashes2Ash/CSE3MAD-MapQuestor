import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function LoginScreen() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    return(
        <View style={styles.loginContainer}>
            <TextInput style={styles.userInputs}
            value={email}
            onChangeText={setEmail}
            placeholder='Your email address'
            placeholderTextColor="gray"
            />

            <TextInput style={styles.userInputs}
            value={password}
            onChangeText={setPassword}
            placeholder='Enter your password'
            placeholderTextColor="gray"
            />
            <TouchableOpacity style={styles.signInButton} onPress={()=>{
                signInWithEmailAndPassword(auth,email,password)
                .then((userCredential)=>{
                    const user=userCredential.user;
                    console.log("You've done it! You've logged in. I'm so proud");
                })
                .catch((error)=>{
                    console.log("You've failed, and this is why: ",error.message);
                })
                }}><Text style={styles.signInText}>Log in</Text></TouchableOpacity>
    </View>
    )
}
const styles= StyleSheet.create({
    loginContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding: 20
    },
    userInputs:{
        padding: 10,
        width:'50%',
        backgroundColor:'#e6e6e6',
        marginBottom:12,
        borderRadius:6
    },
    signInButton:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#50546B',
        width: '50%',
        height: 30
    },
    signInText:{
        color:'white'
    }
})
