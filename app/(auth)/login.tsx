import Google from "../assets/images/google.svg";
import TextInputField from "../components/TextInputField";
import Colors from "../constants/Colors";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useState } from "react";

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return Alert.alert("All fields are required");
    login({ email }); // Add password check in real app
    router.replace("/(main)/home");
  };

  const handleSignup = () => {
    router.push("/(auth)/signup");
  };

  const handleForgetPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View style={styles.container}>
      <View style={styles.maincontainer}>
        <Text style={styles.text}>Login</Text>
        <View style={styles.signup}>
          <Google />
          <Text style={styles.signuptext}>Google</Text>
        </View>

        <Text style={styles.divide}>Or</Text>

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

        <Pressable
          onPress={handleForgetPassword}
          style={{ alignSelf: "flex-end" }}>
          <Text style={styles.forgettext}>Forget Password?</Text>
        </Pressable>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handleLogin}
          style={styles.button}>
          <Text style={styles.buttontext}>Login</Text>
        </Pressable>
        <Text style={styles.login}>
          Don't have an account?{" "}
          <Text
            onPress={handleSignup}
            style={styles.logintext}>
            Sign up
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
    fontFamily: "poppins-bold",
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

export default LoginScreen;
