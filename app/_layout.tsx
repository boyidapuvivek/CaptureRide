// app/_layout.tsx
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

function LayoutManager() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "poppins-regular": require("../app/assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("../app/assets/fonts/Poppins-Medium.ttf"),
    "poppins-semibold": require("../app/assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-bold": require("../app/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded || loading) return;

    if (user) router.replace("/(main)/home");
    else router.replace("/(auth)/login");
  }, [user, fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <AuthProvider>
      <LayoutManager />
    </AuthProvider>
    // </SafeAreaView>
  );
}
