import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../contexts/AuthContext";
import { handleError } from "../../utils/errorHandler";
import { useRouter } from "expo-router";

const Profile = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handlePress = async () => {
    try {
      await logout("user logged  out");

      router.replace("/(auth)/login");
    } catch (error) {
      throw new handleError(error);
    }
  };

  return (
    <View>
      <CustomButton
        title={"Logout"}
        onPress={handlePress}
      />
    </View>
  );
};

export default Profile;
