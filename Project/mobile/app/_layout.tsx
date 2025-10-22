import SafeScreen from "../components/SafeScreen";
import { Stack } from "expo-router";

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from "expo-font";
import Welcome1 from "./(welcome)/welcome1";
import Welcome2 from "./(welcome)/welcome2";

import { Slot } from "expo-router";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Baloo2-Regular": require("../assets/fonts/Baloo2-Regular.ttf"),
  "Baloo2-SemiBold": require("../assets/fonts/Baloo2-SemiBold.ttf"),
  "Baloo2-Bold": require("../assets/fonts/Baloo2-Bold.ttf"),
  "Athiti-Light": require("../assets/fonts/Athiti-Light.ttf"),
  "Athiti-Regular": require("../assets/fonts/Athiti-Regular.ttf"),
  "Athiti-SemiBold": require("../assets/fonts/Athiti-SemiBold.ttf"),
  "Bellota-Light": require("../assets/fonts/Bellota-Light.ttf"),
  "Bellota-Regular": require("../assets/fonts/Bellota-Regular.ttf"),
  "Bellota-Bold": require("../assets/fonts/Bellota-Bold.ttf"),
  "BellotaText-Light": require("../assets/fonts/BellotaText-Light.ttf"),
  "BellotaText-Regular": require("../assets/fonts/BellotaText-Regular.ttf"),
  "Mali-SemiBold": require("../assets/fonts/Mali-SemiBold.ttf"),
  "Borel-Regular": require("../assets/fonts/Borel-Regular.ttf"),
  });

  console.log("fontsLoaded:", fontsLoaded);


    if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        {/* <Slot /> */}
         <Welcome1 />
      </SafeScreen>
    </ClerkProvider>
  );
}

