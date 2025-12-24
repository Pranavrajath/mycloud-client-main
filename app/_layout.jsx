import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import GlobalProvider from "../context/GlobalProvider";
import { WebRTCProvider } from "../context/WebRTCProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
const [fontsLoaded, error]= useFonts({
    "Montserrat-black" : require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold" : require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold" : require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight" : require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light" : require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium" : require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular" : require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold" : require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin" : require("../assets/fonts/Montserrat-Thin.ttf"),
}); 

useEffect(()=>{
  if(error) throw error;
  if(fontsLoaded) SplashScreen.hideAsync();
},[fontsLoaded,error]);

if(!fontsLoaded && !error) return null;

  return (
  <WebRTCProvider>
  <GlobalProvider>
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="(onBoard)" options={{headerShown:false}}/>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
      <Stack.Screen name="(screens)" options={{headerShown:false}}/>
    </Stack>
  </GlobalProvider>
  </WebRTCProvider>
  )
}

export default RootLayout; 