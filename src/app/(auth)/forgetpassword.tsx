import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BackArrow from "../../assets/icons/arrow_back.svg";
import TextInputField from "../../components/TextInputField";
import CustomButton from "../../components/CustomButton";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

const ForgetPassword = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/(auth)/otp");
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.back();
        }}>
        <BackArrow
          height={24}
          width={24}
        />
      </Pressable>

      <View style={styles.mainContainer}>
        <Text style={styles.text}>Forgot Password</Text>

        <TextInputField placeholder="Email I'D/Mobile Number" />

        <CustomButton
          title='Continue'
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 30,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    maxHeight: "40%",
  },
  text: {
    fontFamily: "poppins-semibold",
    fontSize: 32,
    color: Colors.primary,
  },
});

export default ForgetPassword;
