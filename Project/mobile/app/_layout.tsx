import SafeScreen from "../components/SafeScreen";
import { Stack } from "expo-router";

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from "expo-font";
import Welcome1 from "./(welcome)/welcome1";
import Welcome2 from "./(welcome)/welcome2";
import SignUp from "./(auth)/signUp";
import SignIn from "./(auth)/signIn";
import Test from "./(auth)/dang_ky";
import Test2 from "./(welcome)/test";

import { Slot } from "expo-router";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Baloo2-Regular": require("../assets/fonts/Baloo/Baloo2-Regular.ttf"),
    "Baloo2-SemiBold": require("../assets/fonts/Baloo/Baloo2-SemiBold.ttf"),
    "Baloo2-Bold": require("../assets/fonts/Baloo/Baloo2-Bold.ttf"),
    "Baloo2-ExtraBold": require("../assets/fonts/Baloo/Baloo2-ExtraBold.ttf"),

    "Athiti-Light": require("../assets/fonts/Athiti/Athiti-Light.ttf"),
    "Athiti-Regular": require("../assets/fonts/Athiti/Athiti-Regular.ttf"),
    "Athiti-SemiBold": require("../assets/fonts/Athiti/Athiti-SemiBold.ttf"),
    "Athiti-Medium": require("../assets/fonts/Athiti/Athiti-SemiBold.ttf"),
    
    "Bellota-Light": require("../assets/fonts/Bellota/Bellota-Light.ttf"),
    "Bellota-Regular": require("../assets/fonts/Bellota/Bellota-Regular.ttf"),
    "Bellota-Bold": require("../assets/fonts/Bellota/Bellota-Bold.ttf"),

    "BellotaText-Light": require("../assets/fonts/Bellota_Text/BellotaText-Light.ttf"),
    "BellotaText-Regular": require("../assets/fonts/Bellota_Text/BellotaText-Regular.ttf"),
    "BellotaText-Bold": require("../assets/fonts/Bellota_Text/BellotaText-Bold.ttf"),

    "Mali-Light": require("../assets/fonts/Mali/Mali-Light.ttf"),
    "Mali-Regular": require("../assets/fonts/Mali/Mali-Regular.ttf"),
    "Mali-SemiBold": require("../assets/fonts/Mali/Mali-SemiBold.ttf"),
    "Borel-Regular": require("../assets/fonts/Borel/Borel-Regular.ttf"),
  });

  console.log("fontsLoaded:", fontsLoaded);


  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        {/* <Slot /> */}
        {/* <Welcome1 /> */}
        {/* <Welcome2 /> */}
        {/* <SignUp /> */}
        {/* <DangNhap /> */}
        {/* <SignIn/> */}
        <SignUp/>
        {/* <Test/> */}
      </SafeScreen>
    </ClerkProvider>
  );
}

