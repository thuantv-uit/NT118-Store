import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Index() {

  const { isSignedIn } = useAuth()

  return isSignedIn 
  ?  <Redirect href="/(shipper)"/>
    : <Redirect href="/(auth)/sign-in"/>
}