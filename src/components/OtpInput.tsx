import React, { useRef, useState } from "react"
import { View, TextInput, StyleSheet, Text } from "react-native"
import Colors from "../constants/Colors"

type OTPInputProps = {
  length: number
  value: string
  onChange: (otp: string) => void
  error?: string
}

const OTPInput = ({ length, value, onChange, error }: OTPInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([])
  const [focused, setFocused] = useState(-1)

  const handleOTPChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return

    const newOTP = value.split("")
    newOTP[index] = text

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    onChange(newOTP.join(""))
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      const newOTP = value.split("")

      if (newOTP[index]) {
        // Clear current field
        newOTP[index] = ""
      } else if (index > 0) {
        // Move to previous field and clear it
        newOTP[index - 1] = ""
        inputRefs.current[index - 1]?.focus()
      }

      onChange(newOTP.join(""))
    }
  }

  const handleFocus = (index: number) => {
    setFocused(index)
    // Select all text when focused
    setTimeout(() => {
      inputRefs.current[index]?.setSelection(0, 1)
    }, 100)
  }

  const handleBlur = () => {
    setFocused(-1)
  }

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              value[index] && styles.otpInputFilled,
              focused === index && styles.otpInputFocused,
              error && styles.otpInputError,
            ]}
            value={value[index] || ""}
            onChangeText={(text) => handleOTPChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            maxLength={1}
            keyboardType='numeric'
            textAlign='center'
            selectTextOnFocus
            autoComplete='one-time-code'
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    fontSize: 20,
    fontFamily: "poppins-semibold",
    color: Colors.primary,
    backgroundColor: Colors.white,
    textAlign: "center",
  },

  otpInputFilled: {
    borderColor: Colors.primary,
  },

  otpInputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  otpInputError: {
    borderColor: "#ff4d4d",
  },

  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    fontFamily: "poppins-regular",
    marginTop: 8,
    textAlign: "center",
  },
})

export default OTPInput
