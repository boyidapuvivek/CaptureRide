import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import styles from "../styles/SignUpScreen";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !name || !password) {
      alert("Please fill all the fields");
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User Created Successfully");
      navigation.navigate("Login");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Sign up</Text>

      <TextInput
        style={styles.textField}
        placeholder="Enter Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.textField}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.textField}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleSignup}>
        <Text>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin}>
        <Text>Already SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
