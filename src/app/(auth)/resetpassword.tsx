import React, { useState, useEffect } from "react"
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
import { useRouter, useLocalSearchParams } from "expo-router"
import { userApi } from "../../api/apiService"
import { resetPasswordSchema } from "../../utils/validationSchemas"
import { z } from "zod"

const ResetPassword = () => {
  const router = useRouter()
  const { email, otpVerified } = useLocalSearchParams<{
    email: string
    otpVerified: string
  }>()

  // Form state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [loading, setLoading] = useState(false)

  // Check if OTP was verified
  const [isOTPVerified, setIsOTPVerified] = useState(false)

  useEffect(() => {
    if (otpVerified === "true") {
      setIsOTPVerified(true)
    } else {
      // If OTP wasn't verified, redirect back
      Alert.alert(
        "Unauthorized Access",
        "Please complete the OTP verification first.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/forgot-password"),
          },
        ]
      )
    }
  }, [otpVerified, router])

  // Clear errors when user types
  const clearErrors = () => {
    setPasswordError("")
    setConfirmPasswordError("")
  }

  // Reset password
  const handleResetPassword = async () => {
    clearErrors()

    // Validate passwords
    try {
      resetPasswordSchema.parse({
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.includes("newPassword")) {
            setPasswordError(err.message)
          } else if (err.path.includes("confirmPassword")) {
            setConfirmPasswordError(err.message)
          }
        })
        return
      }
    }

    if (!isOTPVerified) {
      Alert.alert("Error", "Please verify OTP first")
      return
    }

    setLoading(true)

    try {
      const response = await userApi.resetPassword(email!, newPassword.trim())

      if (response.success) {
        Alert.alert(
          "Successfully Changed",
          "Please log in with your new password.",
          [
            {
              text: "OK",
              onPress: () => {
                router.push("/(auth)/login")
              },
            },
          ]
        )
      }
    } catch (error) {
      console.error("Error resetting password:", error)

      let errorMessage = "Failed to reset password. Please try again."

      if (error.message.includes("expired")) {
        errorMessage = "Session expired. Please start over."
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOTPVerified) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator
          size='large'
          color={Colors.primary}
        />
        <Text style={styles.loadingText}>Verifying access...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}>
        <BackArrow
          height={24}
          width={24}
        />
      </Pressable>

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>Please enter your new password.</Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.completedStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>1</Text>
          </View>
          <View style={[styles.stepLine, styles.activeStepLine]} />
          <View style={[styles.step, styles.completedStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>2</Text>
          </View>
          <View style={[styles.stepLine, styles.activeStepLine]} />
          <View style={[styles.step, styles.activeStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>3</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.stepContainer}>
            <TextInputField
              placeholder='New Password'
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text)
                if (passwordError) setPasswordError("")
              }}
              error={passwordError}
            />

            <TextInputField
              placeholder='Confirm New Password'
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                if (confirmPasswordError) setConfirmPasswordError("")
              }}
              error={confirmPasswordError}
            />

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementTitle}>
                Password Requirements:
              </Text>
              <Text style={styles.requirementText}>
                • At least 6 characters long
              </Text>
              <Text style={styles.requirementText}>
                • Contains letters and numbers
              </Text>
              <Text style={styles.requirementText}>
                • Avoid common passwords
              </Text>
            </View>
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={loading ? "Resetting..." : "Reset Password"}
            onPress={handleResetPassword}
            disabled={
              loading ||
              !newPassword.trim() ||
              !confirmPassword.trim() ||
              !isOTPVerified
            }
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

  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontFamily: "poppins-regular",
    fontSize: 16,
    color: Colors.grayText,
    marginTop: 10,
  },

  backButton: {
    alignSelf: "flex-start",
    padding: 5,
    marginTop: 30,
    marginLeft: 22,
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 50,
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

  completedStep: {
    backgroundColor: "#4CAF50",
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

  activeStepLine: {
    backgroundColor: Colors.primary,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },

  stepContainer: {
    gap: 20,
  },

  requirementsContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  requirementTitle: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 8,
  },

  requirementText: {
    fontFamily: "poppins-regular",
    fontSize: 12,
    color: Colors.grayText,
    marginBottom: 4,
  },

  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  loadingIndicator: {
    marginTop: 10,
  },
})

export default ResetPassword
