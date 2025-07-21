// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function App() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/(main)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return null;
}
