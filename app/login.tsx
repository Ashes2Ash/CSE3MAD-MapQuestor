import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';


export default function LoginScreen() {
    const [email,setEmail]=useState("email");
    const [password,setPassword]=useState("password");
    return(
        <View>
            <TextInput
            value={email}
            onChangeText={setEmail}
            />

            <TextInput
            value={password}
            onChangeText={setPassword}
            />
            <Button title='Login' onPress={()=>{}}/>
            <Button title='Sign up for an account' onPress={()=>{}}/>
    </View>
    )
}