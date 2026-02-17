import { Button, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useContext } from 'react'
import { AuthContext } from '@/hooks/auth-context'

export default function SignOutButton() {
  const { } = useContext(AuthContext)

  const logout = async () => {
    await supabase.auth.signOut()
    Alert.alert('Suksess', 'Du er logget ut')
  }

  return <Button title="Log out" onPress={logout} />
}