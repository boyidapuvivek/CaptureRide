import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { logout } = useAuth();

  const handlePress = () => {
    logout();
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
