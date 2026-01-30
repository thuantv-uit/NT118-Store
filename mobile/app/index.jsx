import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Index() {

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return isSignedIn 
  ?  <Redirect href="/(home)"/>
    : <Redirect href="/(auth)/sign-in"/>
}

// test comment