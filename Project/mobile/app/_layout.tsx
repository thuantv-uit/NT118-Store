// NT118-Store/Project/mobile/app/_layout.tsx
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from "expo-font";
import Welcome1 from "./(welcome)/welcome1";
import Welcome2 from "./(welcome)/welcome2";
import SignUp from "./(auth)/signUp";
import SignIn from "./(auth)/signIn";
import OTP from "./(auth)/otpScreen";
import ForgotPassword from "./(auth)/forgotPassword";
import Test from "./(auth)/resetPassword";
import Test2 from "./(welcome)/test";
import FunctionalIconsPreview from "./(welcome)/FunctionalIconsPreview";
import Home from "./(root)/homeScreen";
import ProductDetail from "./(product)/[id]";
import ProductCreate from "./(seller)/product-create";
import SellerCreateProduct from "./(seller)/sellercreateproduct";
import SelectCategory from "./(seller)/select-category";

import React, { useEffect } from "react";
import SafeScreen from "../components/SafeScreen";
import { ActivityIndicator, View } from "react-native";


import { Slot } from "expo-router";
import { API_URL } from '@/constants/api';

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

    "CherryBombOne-Regular": require("../assets/fonts/Cherry/CherryBombOne-Regular.ttf"),

    "Nunito-Black": require("../assets/fonts/Nunito/Nunito-Black.ttf"),
    "Nunito-BlackItalic": require("../assets/fonts/Nunito/Nunito-BlackItalic.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito/Nunito-Bold.ttf"),
    "Nunito-BoldItalic": require("../assets/fonts/Nunito/Nunito-BoldItalic.ttf"),
    "Nunito-ExtraBold": require("../assets/fonts/Nunito/Nunito-ExtraBold.ttf"),
    "Nunito-ExtraBoldItalic": require("../assets/fonts/Nunito/Nunito-ExtraBoldItalic.ttf"),
    "Nunito-ExtraLight": require("../assets/fonts/Nunito/Nunito-ExtraLight.ttf"),
    "Nunito-ExtraLightItalic": require("../assets/fonts/Nunito/Nunito-ExtraLightItalic.ttf"),
    "Nunito-Italic": require("../assets/fonts/Nunito/Nunito-Italic.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito/Nunito-Light.ttf"),
    "Nunito-LightItalic": require("../assets/fonts/Nunito/Nunito-LightItalic.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito/Nunito-Medium.ttf"),
    "Nunito-MediumItalic": require("../assets/fonts/Nunito/Nunito-MediumItalic.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    "Nunito-SemiBoldItalic": require("../assets/fonts/Nunito/Nunito-SemiBoldItalic.ttf"),




  });

  console.log("fontsLoaded:", fontsLoaded);
  useEffect(() => {
    fetch(`${API_URL}/ping`).catch(() => { });
  }, []);


  if (!fontsLoaded)
    return (
      <SafeScreen>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#BE123C" />
        </View>
      </SafeScreen>
    );

  return (
    // <ClerkProvider tokenCache={tokenCache}>
    //   <SafeScreen>
    //     {/* <Slot /> */}
    //     {/* <Welcome1 /> */}
    //     {/* <Welcome2 /> */}
    //     {/* <SignUp /> */}
    //     {/* <DangNhap /> */}
    //     {/* <SignIn/> */}
    //     {/* <SignUp/> */}
    //     {/* <ForgotPassword/> */}
    //     {/* <Test/> */}
    //     {/* <FunctionalIconsPreview/> */}
    //     <Home/>

    //     {/* <OTP/> */}
    //   </SafeScreen>
    // </ClerkProvider>
    <ClerkProvider tokenCache={tokenCache}>
      {/* <SafeScreen> */}
      <Slot />
      {/* <Welcome1 /> */}
      {/* <Welcome2 /> */}
      {/* <SignUp /> */}
      {/* <DangNhap /> */}
      {/* <SignIn/> */}
      {/* <SignUp/> */}
      {/* <ForgotPassword/> */}
      {/* <Test/> */}
      {/* <FunctionalIconsPreview/> */}
      {/* <ProductDetail/> */}
      {/* <ProductDetail/> */}
      {/* <ProductCreate/> */}
      {/* <SellerCreateProduct/> */}
      {/* <SelectCategory/> */}
      {/* <SelectCategory /> */}
      {/* <Home/> */}

      {/* <OTP/> */}
      {/* </SafeScreen> */}
      {/* return ( */}
      {/* <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_KEY}> */}
      {/* <SafeScreen> */}
      {/* <Slot /> Quan trọng: render route con */}
      {/* </SafeScreen> */}
    </ClerkProvider>
  );
}

