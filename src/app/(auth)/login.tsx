import TextInputField from "../../components/TextInputField"
import Colors from "../../constants/Colors"
import { useRouter } from "expo-router"
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  Dimensions,
} from "react-native"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import CustomButton from "../../components/CustomButton"
import Loader from "../../components/Loader"
import { apiRoute } from "../../api/apiConfig"
import { Values } from "../../constants/Values"
import { loginSchema } from "../../utils/validationSchemas"

const { width, height } = Dimensions.get("window")

const LoginScreen = () => {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  useEffect(() => {
    const backAction = () => {
      // Exit the app when back button is pressed on login screen
      BackHandler.exitApp()
      return true // prevent default back behavior
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )

    // Cleanup function to remove the listener when component unmounts
    return () => {
      backHandler.remove()
    }
  }, [])

  const validateFields = () => {
    const validation = loginSchema.safeParse({ email, password })

    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {}

      validation.error.errors.forEach((error) => {
        const fieldName = error.path[0] as string
        if (fieldName === "email" || fieldName === "password") {
          fieldErrors[fieldName] = error.message
        }
      })

      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleLogin = async (email: string, password: string) => {
    if (!validateFields()) {
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(apiRoute.LOGIN, { email, password })
      const { accessToken, refreshToken, userData } = res?.data
      await login(accessToken, refreshToken, userData)
      setLoading(false)
      router.replace("/(main)/home")
    } catch (err: any) {
      setLoading(false)
      if (err?.response?.status === 401) {
        Alert.alert("Login failed", "Invalid password")
      } else if (err?.response?.status === 404) {
        Alert.alert("Login failed", "Invalid email")
      } else {
        Alert.alert("Login failed", "Something went wrong, try again")
      }
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

  return loading ? (
    <Loader />
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.maincontainer}>
          <Text style={styles.text}>Login</Text>

          <View style={styles.valueContainer}>
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

            <Pressable
              onPress={() => router.push("/(auth)/forgetpassword")}
              style={{ alignSelf: "flex-end" }}>
              <Text style={styles.forgettext}>Forget Password?</Text>
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView
          style={styles.bottomContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={20}>
          <CustomButton
            title='Login'
            onPress={() => handleLogin(email, password)}
          />
          <Text style={styles.login}>
            Don't have an account?{" "}
            <Text
              onPress={() => router.push("/(auth)/signup")}
              style={styles.logintext}>
              Sign up
            </Text>
          </Text>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    paddingHorizontal: width * 0.05, // 5% of screen width
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "poppins-bold",
    fontSize: width * 0.08, // responsive font size (8% of screen width)
    color: Colors.primaryText,
    marginBottom: height * 0.08, // spacing responsive
  },
  valueContainer: {
    gap: 20,
  },
  signup: {
    flexDirection: "row",
    gap: width * 0.03,
    backgroundColor: Colors.transparent,
    borderRadius: 18,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.012,
  },
  signuptext: {
    fontFamily: "poppins-medium",
    fontSize: width * 0.04,
    color: Colors.gray,
  },
  divide: {
    fontSize: width * 0.035,
    color: Colors.gray,
    fontFamily: "poppins-medium",
  },
  bottomContainer: {
    alignItems: "center",
    gap: height * 0.025,
    paddingBottom: height * 0.1, // 10% of screen height
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
  forgettext: {
    fontFamily: "poppins-medium",
    fontSize: width * 0.035,
    color: Colors.grayText,
  },
})

export default LoginScreen
