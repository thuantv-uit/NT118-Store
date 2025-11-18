import { Redirect } from "expo-router";
import { useAuth } from '@clerk/clerk-expo';

export default function Index() {
  const { isSignedIn } = useAuth();

  // Nếu đã đăng nhập, chuyển đến home
  if (isSignedIn) {
    return <Redirect href="/(home)" />;
  }

  // Chưa đăng nhập, chuyển đến welcome
  return <Redirect href="/(welcome)" />;
}