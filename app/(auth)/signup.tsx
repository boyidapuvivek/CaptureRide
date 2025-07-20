import Google from "../assets/images/google.svg";
import TextInputField from "../components/TextInputField";
import Colors from "../constants/Colors";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { signupUser } from "../api/auth";
import axios from "axios";

const SignUpScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (username, email, password) => {
    if (!username || !email || !password)
      return Alert.alert("All fields are required", "Please enter all fields");

    try {
      const res = await axios.post(
        "http://192.168.1.3:5000/api/v1/user/register",
        {
          username,
          email,
          password,
        }
      );

      const data = res.data;

      router.push("/(auth)/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error?.message);
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };
  return (
    <View style={styles.container}>
      <View style={styles.maincontainer}>
        <Text style={styles.text}>Sign Up</Text>
        <View style={styles.signup}>
          <Google />
          <Text style={styles.signuptext}>Google</Text>
        </View>

        <Text style={styles.divide}>Or</Text>

        <TextInputField
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
        />
        <TextInputField
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
        <TextInputField
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => handleSignup(username, email, password)}
          style={styles.button}>
          <Text style={styles.buttontext}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.login}>
          Do you have an account?{" "}
          <Text
            onPress={handleLogin}
            style={styles.logintext}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    paddingHorizontal: 22,
  },
  maincontainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 50,
    gap: 20,
  },
  text: {
    fontFamily: "poppins-semibold",
    fontSize: 32,
    color: Colors.primaryText,
  },
  signup: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.transparent,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  signuptext: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.gray,
  },
  divide: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: "poppins-medium",
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 20,
  },
  button: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  buttontext: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
  },
  login: {
    fontFamily: "poppins-regular",
    fontSize: 14,
  },
  logintext: {
    fontFamily: "poppins-regular",
    fontSize: 14,
    color: Colors.primary,
  },
  forgettext: {
    fontFamily: "poppin-medium",
    fontSize: 14,
    color: Colors.grayText,
  },
});

export default SignUpScreen;
