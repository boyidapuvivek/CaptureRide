import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import BackArrow from "../../assets/icons/arrow_back.svg";
import { useRouter } from "expo-router";
import TextInputField from "../../components/TextInputField";

const ForgetPassowrd = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/(auth)/resetpassword");
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
        <Text style={styles.text}>Reset Password</Text>

        <TextInputField
          placeholder='New Password'
          secureTextEntry={true}
        />

        <TextInputField
          placeholder='Re-enter Password'
          secureTextEntry={true}
        />

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
    maxHeight: "60%",
  },
  text: {
    fontFamily: "poppins-semibold",
    fontSize: 32,
    color: Colors.primary,
  },
});

export default ForgetPassowrd;
