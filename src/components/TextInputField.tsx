import Colors from "../constants/Colors"
import React, { ReactNode, useState } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

type TextInputFieldProps = {
  placeholder: string
  secureTextEntry?: boolean
  value: string
  onChangeText: (text: string) => void
  children?: ReactNode
  error?: string
}

const TextInputField = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  children,
  error,
}: TextInputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isPassword = secureTextEntry === true
  const shouldHideText = isPassword && !isPasswordVisible

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, error && styles.inputContainerError]}>
        {children}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.grayText}
          secureTextEntry={shouldHideText}
          value={value}
          onChangeText={onChangeText}
          style={styles.textInput}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}>
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={Colors.grayText}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 10,
  },

  inputContainerError: {
    borderColor: "#ff4d4d",
  },

  textInput: {
    flex: 1,
    fontFamily: "poppins-regular",
    fontSize: 18,
    height: 45,
    color: Colors.black,
  },

  eyeIconContainer: {
    paddingHorizontal: 6,
  },

  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    fontFamily: "poppins-regular",
    marginTop: 6,
    marginLeft: 4,
  },
})

export default TextInputField
