// React imports for state and component rendering
import { useState } from 'react';

// React Native components for layout, input fields, and touchable buttons
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Firebase authentication function for logging in users with email/password
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Firebase config (imported auth instance)

// Expo Router navigation object for screen transitions
import { router } from 'expo-router';

// Component: LoginScreen
// This screen handles user login and provides navigation to sign-up and map selection screens.
export default function LoginScreen() {
  // State variables for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.loginContainer}>
      {/* Email Input */}
      <TextInput
        style={styles.userInputs}
        value={email}
        onChangeText={setEmail}
        placeholder='Your email address'
        placeholderTextColor="gray"
        autoCapitalize='none' // Prevents iOS from capitalizing email input
        keyboardType='email-address' // Optimizes the keyboard for email input
      />

      {/* Password Input */}
      <TextInput
        style={styles.userInputs}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter your password'
        placeholderTextColor="gray"
        secureTextEntry // Hides password characters as the user types
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => {
          // Attempts to sign in using Firebase Auth with trimmed, lowercased email
          signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("✅ Login successful:", user.email);
              // You could navigate here after login success
            })
            .catch((error) => {
              // Logs error message on login failure
              console.log("❌ Login failed:", error.message);
            });
        }}
      >
        <Text style={styles.signInText}>Log in</Text>
      </TouchableOpacity>

      {/* Navigation to Sign Up screen */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/signUp')}>
        <Text style={styles.signInText}>Go to Sign Up</Text>
      </TouchableOpacity>

      {/* Temporary Navigation to Map Selector (for development/testing) */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/mapSelector')}>
        <Text style={styles.signInText}>Go to mapSelector test</Text>
      </TouchableOpacity>
    </View>
  );
}

// StyleSheet for consistent layout and appearance
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1, // Fills the entire screen
    justifyContent: 'center', // Vertically center contents
    alignItems: 'center',     // Horizontally center contents
    padding: 20               // Space inside the container
  },
  userInputs: {
    padding: 10,              // Inner spacing inside the input
    width: '50%',            // Input width relative to the container
    backgroundColor: '#e6e6e6', // Light gray background
    marginBottom: 12,        // Space below each input
    borderRadius: 6          // Rounded corners
  },
  signInButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#50546B', // Dark muted blue background
    width: '50%',
    height: 30,
    marginTop: 12              // Space above the button
  },
  signInText: {
    color: 'white'             // White text inside buttons
  }
});
