// React and React Native imports
import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Firebase authentication methods for sign-up and email verification
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Firebase configuration and auth instance

// Expo Router's navigation object
import { router } from 'expo-router';

// Component: SignUpScreen
// This screen handles user registration and sends an email verification link
export default function SignUpScreen() {
  // State hooks to capture email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    <View style={styles.signUpContainer}>
      <Text style={styles.title}>Sign Up for an Account!</Text>
      {/* Email input field */}
      <TextInput
        style={styles.userInputs}
        value={email}
        onChangeText={setEmail}
        placeholder='Your email address'
        placeholderTextColor="gray"
      />

      {/* Password input field */}
      <TextInput
        style={styles.userInputs}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter your password'
        placeholderTextColor="gray"
      />

      {/* Sign Up button */}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => {
          // Attempt to create a new Firebase user
          createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("You've done it! You've signed up. I'm so proud");

              // Send email verification after successful signup
              sendEmailVerification(user)
                .then(() => {
                  console.log("Verification email sent");

                  // Navigate back to the login screen
                  router.push('./index');
                })
                .catch((error) => {
                  console.log("Failed to send verification:", error.message);
                });
            })
            .catch((error) => {
              console.log("You've failed, and this is why: ", error.message);
            });
        }}
      >
        <Text style={styles.signInText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}
const styles = StyleSheet.create({
  screen:{
    flex:1
  },
  title:{
    padding:20,
    fontSize:20
  },
  signUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  userInputs: {
    padding: 10,
    width: '50%',
    backgroundColor: '#e6e6e6',
    marginBottom: 12,
    borderRadius: 6
  },
  signUpButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    width: '50%',
    height: 30
  },
  signInText: {
    color: 'white'
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
