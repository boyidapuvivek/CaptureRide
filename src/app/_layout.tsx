// app/_layout.tsx
import { Stack } from "expo-router"
import { useFonts } from "expo-font"
import { useEffect } from "react"
import { View, ActivityIndicator, StatusBar } from "react-native"
import { AuthProvider } from "../contexts/AuthContext"
import * as SplashScreen from "expo-splash-screen"
import Colors from "../constants/Colors"

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "poppins-semibold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <AuthProvider>
      <StatusBar
        hidden
        translucent
      />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  )
}
