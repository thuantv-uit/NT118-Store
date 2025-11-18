import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function HomeRoutesLayout() {
  const { isSignedIn } = useAuth()

  // Nếu chưa đăng nhập, chuyển về welcome
  if (!isSignedIn) {
    return <Redirect href={'/(welcome)'} />
  }

  return <Stack screenOptions={{headerShown: false}} />
}