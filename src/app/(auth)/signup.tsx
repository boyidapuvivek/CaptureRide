import Google from "../../assets/images/google.svg"
import TextInputField from "../../components/TextInputField"
import Colors from "../../constants/Colors"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "expo-router"
import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native"
import { useState } from "react"
import * as SecureStore from "expo-secure-store"
import axios from "axios"
import { Values } from "../../constants/Values"
import { apiRoute } from "../../api/apiConfig"
import { signupSchema } from "../../utils/validationSchemas"

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

      const data = res.data
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(auth)/login"),
        },
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
        <View style={styles.signup}>
          <Google />
          <Text style={styles.signuptext}>Google</Text>
        </View>

        <Text style={styles.divide}>Or</Text>

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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    paddingHorizontal: Values.paddingHorizontal,
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
})

export default SignUpScreen
