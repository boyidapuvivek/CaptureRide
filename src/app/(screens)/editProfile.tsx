import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "../../constants/Colors"
import TextInputField from "../../components/TextInputField"
import CustomButton from "../../components/CustomButton"
import { editProfileSchema } from "../../utils/validationSchemas"
import axios from "axios"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"

const EditProfile = () => {
  const router = useRouter()
  const token = useFetchToken()
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  })

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Validation function using Zod
  const validateForm = () => {
    try {
      editProfileSchema.parse(formData)
      setErrors({}) // Clear errors if validation passes
      return true
    } catch (error) {
      if (error.errors) {
        const newErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0]
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  // Handle form submission
  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare request data - only include non-empty fields
      const requestData = {
        currentPassword: formData.currentPassword,
      }

      if (formData.username && formData.username.trim()) {
        requestData.username = formData.username.trim()
      }
      if (formData.email && formData.email.trim()) {
        requestData.email = formData.email.trim()
      }
      if (formData.newPassword && formData.newPassword.trim()) {
        requestData.newPassword = formData.newPassword.trim()
      }

      // Make API call (replace with your actual API endpoint)
      const response = await axios.patch(apiRoute.EDITPROFILE, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = response?.data

      if (response.status === 200) {
        Alert.alert(
          "Successfuly Changed",
          data.message || "Profile updated successfully",
          [
            {
              text: "OK",
              onPress: () => {
                if (data?.requireReauth) {
                  router.push("/(auth)/login")
                } else {
                  router.back()
                }
              },
            },
          ]
        )
      }
    } catch (error) {
      console.error("Update profile error:", error)
      Alert.alert(
        "Error",
        error.response?.data?.message || "Network error. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.mainContainer}>
        <Header
          title={"Edit Profile"}
          showProfile={false}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Update your account information. Current password is required for
              security.
            </Text>
          </View>

          {errors.general && (
            <Text style={styles.generalError}>{errors.general}</Text>
          )}

          <View style={styles.form}>
            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username (Optional)</Text>
              <TextInputField
                placeholder='Enter new username'
                value={formData.username}
                onChangeText={(text) => handleInputChange("username", text)}
                error={errors.username}>
                <Ionicons
                  name='person-outline'
                  size={20}
                  color={Colors.grayText}
                />
              </TextInputField>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInputField
                placeholder='Enter new email'
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                error={errors.email}>
                <Ionicons
                  name='mail-outline'
                  size={20}
                  color={Colors.grayText}
                />
              </TextInputField>
            </View>

            {/* New Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password (Optional)</Text>
              <TextInputField
                placeholder='Enter new password'
                secureTextEntry={true}
                value={formData.newPassword}
                onChangeText={(text) => handleInputChange("newPassword", text)}
                error={errors.newPassword}>
                <Ionicons
                  name='lock-closed-outline'
                  size={20}
                  color={Colors.grayText}
                />
              </TextInputField>
            </View>

            {/* Confirm Password Field - Only show if new password is entered */}
            {formData.newPassword && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInputField
                  placeholder='Confirm new password'
                  secureTextEntry={true}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  error={errors.confirmPassword}>
                  <Ionicons
                    name='lock-closed-outline'
                    size={20}
                    color={Colors.grayText}
                  />
                </TextInputField>
              </View>
            )}

            {/* Current Password Field - Required */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Current Password *
              </Text>
              <TextInputField
                placeholder='Enter current password'
                secureTextEntry={true}
                value={formData.currentPassword}
                onChangeText={(text) =>
                  handleInputChange("currentPassword", text)
                }
                error={errors.currentPassword}>
                <Ionicons
                  name='shield-checkmark-outline'
                  size={20}
                  color={Colors.grayText}
                />
              </TextInputField>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? "Updating..." : "Update Profile"}
              onPress={handleUpdateProfile}
              color={loading ? Colors.grayText : Colors.primary}
            />

            <CustomButton
              title='Cancel'
              onPress={() => router.back()}
              color={Colors.white}
              fontColor={Colors.primary}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
  scrollContainer: {
    flexGrow: 1,
  },

  header: {
    marginBottom: 30,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.grayText,
    lineHeight: 22,
    fontFamily: "poppins-regular",
    paddingTop: 20,
  },

  form: {
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontFamily: "poppins-semibold",
    color: Colors.black,
    marginBottom: 8,
    fontFamily: "poppins-medium",
  },

  requiredLabel: {
    color: Colors.primary,
  },

  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },

  generalError: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#fff5f5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
    fontFamily: "poppins-regular",
  },
})

export default EditProfile
