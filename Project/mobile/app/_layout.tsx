import SafeScreen from "../components/SafeScreen";
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from "expo-font";
import React from "react";


import { Slot } from "expo-router";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Borel-Regular": require("../assets/fonts/Borel/Borel-Regular.ttf"),
    "Baloo": require("../assets/fonts/Baloo/Baloo2-Regular.ttf"),
    "Athiti-Medium": require("../assets/fonts/Athiti/Athiti-Medium.ttf"),
    "Mali-SemiBold": require("../assets/fonts/Mali/Mali-SemiBold.ttf"),
    'Allan-Regular': require('../assets/fonts/Allan/Allan-Regular.ttf'),
    'Athiti-Light': require('../assets/fonts/Athiti/Athiti-Light.ttf'),
    'Athiti-Regular': require('../assets/fonts/Athiti/Athiti-Regular.ttf'),
    'Athiti-SemiBold': require('../assets/fonts/Athiti/Athiti-SemiBold.ttf'),
    'BellotaText-Regular': require('../assets/fonts/Bellota_Text/BellotaText-Regular.ttf'),
    'Bellota-Regular': require('../assets/fonts/Bellota/Bellota-Regular.ttf'),
    'Bellota-Light': require('../assets/fonts/Bellota/Bellota-Light.ttf'),
  });

  console.log("fontsLoaded:", fontsLoaded);


    if (!fontsLoaded) return null;

return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_KEY}>
      <Slot /> {/* Quan trọng: render route con */}
    </ClerkProvider>
  );
}

