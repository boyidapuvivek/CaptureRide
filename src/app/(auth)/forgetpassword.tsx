import React, { useState } from "react"
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import BackArrow from "../../assets/icons/arrow_back.svg"
import TextInputField from "../../components/TextInputField"
import CustomButton from "../../components/CustomButton"
import Colors from "../../constants/Colors"
import { useRouter } from "expo-router"
import { otpApi } from "../../api/apiService"
import { emailSchema } from "../../utils/validationSchemas"
import { z } from "zod"
import { Values } from "../../constants/Values"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ForgotPassword = () => {
  const router = useRouter()
  const inset = useSafeAreaInsets()

  // Form state
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)

  // Clear errors when user types
  const clearErrors = () => {
    setEmailError("")
  }

  // Send OTP to email
  const handleSendOTP = async () => {
    clearErrors()

    // Validate email
    try {
      emailSchema.parse({ email: email.trim() })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message)
        return
      }
    }

    setLoading(true)

    try {
      const response = await otpApi.generateOTP(email.trim(), "password_reset")

      if (response.success) {
        Alert.alert(
          "OTP Sent",
          `A verification code has been sent to ${email}`,
          [
            {
              text: "OK",
              onPress: () => {
                router.push({
                  pathname: "/(auth)/otp",
                  params: { email: email.trim(), type: "password_reset" },
                })
              },
            },
          ]
        )
      }
    } catch (error) {
      console.error("Error sending OTP:", error)

      let errorMessage = "Failed to send OTP. Please try again."

      if (error.message.includes("No user found")) {
        errorMessage = "No account found with this email address."
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}>
        <BackArrow
          height={30}
          width={30}
        />
      </Pressable>

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a verification code.
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.activeStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepText}>3</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.stepContainer}>
            <TextInputField
              placeholder='Enter your email'
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError("")
              }}
              error={emailError}
            />
          </View>
        </View>

        {/* Button */}
        <View style={[styles.buttonContainer, { paddingBottom: inset.bottom }]}>
          <CustomButton
            title={loading ? "Sending..." : "Send Verification Code"}
            onPress={handleSendOTP}
            disabled={loading || !email.trim()}
          />

          {loading && (
            <ActivityIndicator
              size='small'
              color={Colors.primary}
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  backButton: {
    alignSelf: "flex-start",
    padding: 5,
    marginTop: 50,
    marginLeft: 22,
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop - 20,
    paddingBottom: 50,
    justifyContent: "space-between",
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontFamily: "poppins-semibold",
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 15,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "poppins-regular",
    fontSize: 16,
    color: Colors.grayText,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },

  step: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },

  activeStep: {
    backgroundColor: Colors.primary,
  },

  stepText: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: "#666",
  },

  activeStepText: {
    color: Colors.white,
  },

  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },

  contentContainer: {
    flex: 1,
    paddingTop: 50,
  },

  stepContainer: {
    gap: 20,
  },

  buttonContainer: {
    alignItems: "center",
  },

  loadingIndicator: {
    marginTop: 10,
  },
})

export default ForgotPassword
