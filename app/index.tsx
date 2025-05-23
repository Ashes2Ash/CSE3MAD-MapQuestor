import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { router } from 'expo-router';

export default function LoginScreen() {
  //state variables for email and text inputs, and also for error display in the event of an authentication error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState('');
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>MapQuestor</Text>
      {/*MapQuestor Logo*/}
      <Image source={{uri: 'https://firebasestorage.googleapis.com/v0/b/mapquestor-e1b1f.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=256502c1-2b48-4e7c-bc47-7c349e712db4'}}style={{ width: 200, height: 200 }}/>
      <TextInput
        style={styles.userInputs}
        value={email}
        onChangeText={setEmail}
        placeholder='Your email address'
        placeholderTextColor="gray"
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <TextInput
        style={styles.userInputs}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter your password'
        placeholderTextColor="gray"
        secureTextEntry
      />
      {error !== '' ? (<Text style={styles.errorText}>{error}</Text>) : null}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => {
          signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log("✅ Login successful:", user.email);
              setError('');
              // Navigate to MapSelector after successful login
              router.push('/mapSelector');
            })
            .catch((error) => {
              console.log("❌ Login failed:", error.message);
              setError("Login Failed, Please ensure credentials are correct.");
            });
        }}
      >
        <Text style={styles.signInText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/signUp')}>
        <Text style={styles.signInText}>Go to Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
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
  signInButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    width: '50%',
    height: 30,
    marginTop: 12
  },
  signInText: {
    color: 'white'
  },
  errorText:{
    color: 'red',
    marginTop: 10,
  },
  title:{
    fontSize:32
  }
});
