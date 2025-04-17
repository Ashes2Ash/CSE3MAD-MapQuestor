import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { router } from 'expo-router';

export default function SignUpScreen() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    return(
        <View style={styles.signUpContainer}>
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
            <TouchableOpacity style={styles.signUpButton} onPress={()=>{
                createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
                .then((userCredential)=>{
                    const user=userCredential.user;
                    console.log("You've done it! You've signed up. I'm so proud");
                    sendEmailVerification(user)
                        .then(() => {
                            console.log("Verification email sent");
                            router.push('/'); 
                        })
                        .catch((error) => {
                            console.log("Failed to send verification:", error.message);
                        });
                })
                .catch((error)=>{
                    console.log("You've failed, and this is why: ",error.message);
                })
                }}><Text style={styles.signInText}>Sign Up</Text></TouchableOpacity>
    </View>
    )
}
const styles= StyleSheet.create({
    signUpContainer:{
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
    signUpButton:{
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
