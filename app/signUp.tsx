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
    <View style={styles.signUpContainer}>
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
                  router.push('/');
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
  );
}

// StyleSheet for the SignUpScreen layout
const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,                     // Fills the screen vertically
    justifyContent: 'center',   // Centers content vertically
    alignItems: 'center',       // Centers content horizontally
    padding: 20                 // Padding inside the screen
  },
  userInputs: {
    padding: 10,                // Space inside the input
    width: '50%',              // Relative width of the input
    backgroundColor: '#e6e6e6', // Light gray background
    marginBottom: 12,          // Space between inputs
    borderRadius: 6            // Rounded input corners
  },
  signUpButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#50546B', // Button background color
    width: '50%',               // Button width
    height: 30                  // Button height
  },
  signInText: {
    color: 'white'              // Button text color
  }
});
