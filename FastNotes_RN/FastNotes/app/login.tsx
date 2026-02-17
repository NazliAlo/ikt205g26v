// login.tsx
import { AuthContext } from '@/hooks/auth-context'
import { supabase } from '@/lib/supabase'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useContext, useState } from 'react'
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native'

// Definer stack-parametre
type RootStackParamList = {
  Login: undefined
  MainScreen: undefined
  NoteDetailScreen: { noteId: string }
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export default function LoginScreen({ navigation }: Props) {
  const { session } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Sign-up funksjon
  const signUp = async () => {
    if (!email || !password) {
      Alert.alert('Feil', 'E-post og passord kan ikke være tomme')
      return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert('Feil', error.message)
    else Alert.alert('Suksess', 'Bruker opprettet! Sjekk e-posten din.')
  }

  // Login funksjon
  const login = async () => {
    console.log("login pressed")
    if (!email || !password) {
      Alert.alert('Feil', 'E-post og passord kan ikke være tomme')
      return
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    console.log("my session:", session)
    if (error) Alert.alert('Feil', error.message)
    
    
    // session oppdateres automatisk av AuthProvider
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Passord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={signUp} />
      <View style={{ height: 10 }} />
      <Button title="Login" onPress={login} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
})