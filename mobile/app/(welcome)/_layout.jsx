import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function WelcomeRoutesLayout() {
  const { isSignedIn } = useAuth()

  // Nếu đã đăng nhập, chuyển thẳng đến home
  if (isSignedIn) {
    return <Redirect href={'/(home)'} />
  }

  return <Stack screenOptions={{headerShown: false}} />
}
