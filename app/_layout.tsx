import { Slot, useRouter } from "expo-router";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";

export default function Layout() {
  const { user } = useAuth();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "poppins-regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "poppins-semibold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    if (user) router.replace("/(main)/home");
    else router.replace("/(auth)/login");
  }, [user, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return <Slot />;
}
