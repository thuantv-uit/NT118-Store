import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function ProfileRoutesLayout() {
  const { isSignedIn } = useAuth()

  // Nếu chưa đăng nhập, chuyển về welcome
  if (!isSignedIn) {
    return <Redirect href={'/(welcome)'} />
  }

  return <Stack screenOptions={{headerShown: false}} />
}
