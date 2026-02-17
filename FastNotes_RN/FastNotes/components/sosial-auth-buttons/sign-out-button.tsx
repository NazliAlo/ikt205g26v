import { supabase } from '@/lib/supabase'
import { FontAwesome } from '@expo/vector-icons'
import { Alert, Pressable, StyleSheet } from 'react-native'

export default function SignOutButton() {
  const logout = async () => {
    await supabase.auth.signOut()
    Alert.alert('Suksess', 'Du er logget ut')
  }

  return (
    <Pressable onPress={logout} style={styles.button}>
      <FontAwesome name="sign-out" size={20} color="white" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    // Remove absolute if you use headerRight
    position: 'absolute', top: 25, right: 20,
  },
})
