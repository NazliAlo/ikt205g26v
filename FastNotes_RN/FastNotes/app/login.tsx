// login.tsx
import { AuthContext } from '@/hooks/auth-context'
import { supabase } from '@/lib/supabase'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { router } from 'expo-router'
import React, { useContext, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native'

// Stack param definitions
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

  // Sign-up function
  const signUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password cannot be empty')
      return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Success', 'User created! Check your email.')
  }

  // Login function
  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password cannot be empty')
      return
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({ email, password })

    if (error) Alert.alert('Error', error.message)
    else if (session?.access_token) {
      router.replace('/')
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Fast Notes!</Text>
        <Text style={styles.subtitle}>
          Please login or sign up if you don’t have an account
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>OR</Text>

        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#1c1c1c',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
