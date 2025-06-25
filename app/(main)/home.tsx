import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user?.email}</Text>
      <Button
        title='Logout'
        onPress={logout}
      />
    </View>
  );
}
