import TextInputField from "../../components/TextInputField"
import Colors from "../../constants/Colors"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "expo-router"
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
} from "react-native"
import { useState } from "react"
import axios from "axios"
import { Values } from "../../constants/Values"
import { apiRoute } from "../../api/apiConfig"
import { signupSchema } from "../../utils/validationSchemas"
import CustomButton from "../../components/CustomButton"

const { width, height } = Dimensions.get("window")

const SignUpScreen = () => {
  const router = useRouter()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
  }>({})

  const validateFields = () => {
    const validation = signupSchema.safeParse({ username, email, password })

    if (!validation.success) {
      const fieldErrors: {
        username?: string
        email?: string
        password?: string
      } = {}

      validation.error.errors.forEach((error) => {
        const fieldName = error.path[0] as string
        if (
          fieldName === "username" ||
          fieldName === "email" ||
          fieldName === "password"
        ) {
          fieldErrors[fieldName] = error.message
        }
      })

      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (!validateFields()) {
      return
    }

    try {
      const res = await axios.post(apiRoute.REGISTER, {
        username,
        email,
        password,
      })

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/(auth)/login") },
      ])
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.error || error?.message || "Something went wrong"
      )
    }
  }

  const handleUsernameChange = (text: string) => {
    setUsername(text)
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }))
    }
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }

  const handleLogin = () => {
    router.push("/(auth)/login")
  }

  return (
    <View style={styles.container}>
      <View style={styles.maincontainer}>
        <Text style={styles.text}>Sign Up</Text>

        <TextInputField
          placeholder='Username'
          value={username}
          onChangeText={handleUsernameChange}
          error={errors.username}
        />
        <TextInputField
          placeholder='Email'
          value={email}
          onChangeText={handleEmailChange}
          error={errors.email}
        />
        <TextInputField
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          error={errors.password}
        />
      </View>

      <View style={styles.bottomContainer}>
        <CustomButton
          onPress={() => handleSignup(username, email, password)}
          style={styles.button}
          title='Sign Up'
        />

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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: width * 0.06,
  },
  maincontainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: height * 0.025,
  },
  text: {
    fontFamily: "poppins-semibold",
    fontSize: width * 0.08,
    color: Colors.primaryText,
    marginBottom: height * 0.03,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    gap: height * 0.03,
    paddingBottom: height * 0.08,
  },
  button: {
    height: height * 0.06,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttontext: {
    fontFamily: "poppins-medium",
    fontSize: width * 0.045,
    color: Colors.white,
    textAlign: "center",
  },
  login: {
    fontFamily: "poppins-regular",
    fontSize: width * 0.035,
  },
  logintext: {
    fontFamily: "poppins-regular",
    fontSize: width * 0.035,
    color: Colors.primary,
  },
})

export default SignUpScreen
