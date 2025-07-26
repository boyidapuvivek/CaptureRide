import React from "react";
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../contexts/AuthContext";
import { handleError } from "../../utils/errorHandler";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { Values } from "../../constants/Values";
import Header from "../../components/Header";
import axios from "axios";
import { getAccessToken } from "../../utils/authUtils";

const Profile = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const accessToken = getAccessToken();

  const handlePress = async () => {
    try {
      const res = await axios.post(
        "http://192.168.1.100:5000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken._j}`,
          },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failes user logout!!");
      }
      console.log("😊", res);
    } catch (error) {
      throw new Error("Failed user logout!!");
    } finally {
      await logout("user logged  out");
      router.replace("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <Header title={"Profile"} />
      <CustomButton
        title={"Logout"}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
});

export default Profile;
