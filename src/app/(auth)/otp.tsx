import React, { useState, useEffect } from "react"
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import BackArrow from "../../assets/icons/arrow_back.svg"
import OTPInput from "../../components/OtpInput"
import CustomButton from "../../components/CustomButton"
import Colors from "../../constants/Colors"
import { useRouter, useLocalSearchParams } from "expo-router"
import { otpApi } from "../../api/apiService"
import { otpSchema } from "../../utils/validationSchemas"
import { z } from "zod"

const OTPVerification = () => {
  const router = useRouter()
  const { email, type } = useLocalSearchParams<{
    email: string
    type: string
  }>()

  // Form state
  const [otp, setOTP] = useState("")
  const [otpError, setOTPError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  // Timer state
  const [timer, setTimer] = useState(600) // 10 minutes
  const [canResend, setCanResend] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setCanResend(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer])

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Clear errors when user types
  const clearErrors = () => {
    setOTPError("")
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    clearErrors()

    // Validate OTP
    try {
      otpSchema.parse({ otp })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setOTPError(error.errors[0].message)
        return
      }
    }

    setLoading(true)

    try {
      const response = await otpApi.verifyOTP(
        email!,
        otp,
        type || "password_reset"
      )

      if (response.success) {
        Alert.alert("OTP Verified", "Please enter your new password", [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/(auth)/resetpassword",
                params: { email: email!, otpVerified: "true" },
              })
            },
          },
        ])
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)

      let errorMessage = "Invalid OTP. Please try again."

      if (error.message.includes("expired")) {
        errorMessage = "OTP has expired. Please request a new one."
        setCanResend(true)
      } else if (error.message.includes("Maximum attempts")) {
        errorMessage = "Maximum attempts exceeded. Please request a new OTP."
        setCanResend(true)
      }

      setOTPError(errorMessage)
      setOTP("") // Clear OTP on error
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true)
    clearErrors()

    try {
      const response = await otpApi.resendOTP(email!, type || "password_reset")

      if (response.success) {
        setTimer(600) // Reset timer to 10 minutes
        setCanResend(false)
        setOTP("")
        Alert.alert(
          "OTP Resent",
          "A new verification code has been sent to your email"
        )
      }
    } catch (error) {
      console.error("Error resending OTP:", error)

      let errorMessage = "Failed to resend OTP. Please try again."

      if (error.message.includes("wait")) {
        errorMessage = "Please wait before requesting a new OTP."
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setResendLoading(false)
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
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to {email}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.step, styles.completedStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>1</Text>
          </View>
          <View style={[styles.stepLine, styles.activeStepLine]} />
          <View style={[styles.step, styles.activeStep]}>
            <Text style={[styles.stepText, styles.activeStepText]}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepText}>3</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.stepContainer}>
            <OTPInput
              length={6}
              value={otp}
              onChange={(value) => {
                setOTP(value)
                if (otpError) setOTPError("")
              }}
              error={otpError}
            />

            {/* Timer and Resend */}
            <View style={styles.otpFooter}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Code expires in {formatTime(timer)}
                </Text>
              ) : (
                <Text style={styles.expiredText}>Code has expired</Text>
              )}

              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend || resendLoading}
                style={[
                  styles.resendButton,
                  (!canResend || resendLoading) && styles.resendButtonDisabled,
                ]}>
                <Text
                  style={[
                    styles.resendText,
                    (!canResend || resendLoading) && styles.resendTextDisabled,
                  ]}>
                  {resendLoading ? "Resending..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={loading ? "Verifying..." : "Verify Code"}
            onPress={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
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
  },

  stepContainer: {
    gap: 20,
  },

  otpFooter: {
    alignItems: "center",
    marginTop: 20,
  },

  timerText: {
    fontFamily: "poppins-regular",
    fontSize: 14,
    color: Colors.grayText,
    marginBottom: 15,
  },

  expiredText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    color: "#ff4d4d",
    marginBottom: 15,
  },

  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  resendButtonDisabled: {
    opacity: 0.5,
  },

  resendText: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.primary,
    textDecorationLine: "underline",
  },

  resendTextDisabled: {
    color: Colors.grayText,
    textDecorationLine: "none",
  },

  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  loadingIndicator: {
    marginTop: 10,
  },
})

export default OTPVerification
