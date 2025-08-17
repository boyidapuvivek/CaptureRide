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
    gap: 10,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  },

  inputContainerError: {
    borderRightColor: "#ff4444",
    borderBottomColor: "#ff4444",
  },

  textInput: {
    flex: 1,
    fontFamily: "poppins-regular",
    fontSize: 16,
    color: Colors.black,
    height: 40,
  },

  eyeIconContainer: {
    padding: 4,
  },

  errorText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: "poppins-regular",
    marginTop: 4,
    marginLeft: 12,
  },
})

export default TextInputField
