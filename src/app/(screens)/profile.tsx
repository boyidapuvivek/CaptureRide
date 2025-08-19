import React, { useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import CustomButton from "../../components/CustomButton"
import { AuthProvider, useAuth } from "../../contexts/AuthContext"
import { handleError } from "../../utils/errorHandler"
import { useRouter } from "expo-router"
import Colors from "../../constants/Colors"
import { Values } from "../../constants/Values"
import Header from "../../components/Header"
import axios from "axios"
import { getAccessToken } from "../../utils/authUtils"
import Edit from "../../assets/icons/allRides/edit.svg"
import Bike from "../../assets/icons/scooter.svg"
import Info from "../../assets/icons/info.svg"
import Dev from "../../assets/icons/dev.svg"
import { apiRoute } from "../../api/apiConfig"

const Profile = () => {
  const { logout, user, updateUser } = useAuth() // Assuming you have updateUser in AuthContext
  const router = useRouter()
  const accessToken = getAccessToken()
  const [isUploading, setIsUploading] = useState(false)

  // Define quick actions (add icon, label, and handler)
  const quickActions = [
    {
      id: "edit",
      label: "Edit Profile",
      icon: (
        <Edit
          height={24}
          width={24}
        />
      ),
      onPress: () => router.push("/(screens)/editProfile"),
    },
    {
      id: "bikes",
      label: "My Bikes",
      icon: (
        <Bike
          height={24}
          width={24}
        />
      ),
      onPress: () => router.push("/(screens)/myBikes"),
    },
    {
      id: "info",
      label: "Info",
      icon: (
        <Info
          height={24}
          width={24}
        />
      ),
      onPress: () => router.push("/(screens)/aboutApp"),
    },
    {
      id: "dev",
      label: "Developer",
      icon: (
        <Dev
          height={24}
          width={24}
        />
      ),
      onPress: () => router.push("/(screens)/aboutDeveloper"),
    },
  ]

  const handlePress = async () => {
    try {
      const res = await axios.post(
        apiRoute.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken._j}`,
          },
        }
      )

      if (res.status !== 200) {
        throw new Error("Failed user logout!!")
      }
    } catch (error) {
      throw new Error("Failed user logout!!")
    } finally {
      await logout("user logged out")
      router.replace("/(auth)/login")
      AuthProvider().userUpdate(null)
    }
  }

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      )
      return
    }

    // Show action sheet to choose between camera and gallery
    Alert.alert(
      "Select Image",
      "Choose an option to update your profile picture",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Gallery",
          onPress: () => openGallery(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    )
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera is required!"
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      uploadImage(result.assets[0])
    }
  }

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      uploadImage(result.assets[0])
    }
  }

  const uploadImage = async (imageAsset) => {
    try {
      setIsUploading(true)

      // Create FormData
      const formData = new FormData()
      formData.append("avatar", {
        uri: imageAsset.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      })

      const response = await axios.patch(apiRoute.ADDPROFILE, formData, {
        headers: {
          Authorization: `Bearer ${accessToken._j}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        // Update user context with new profile image
        if (updateUser) {
          updateUser({ ...user, avatar: response.data.user.avatar })
        }
        Alert.alert("Success", "Profile image updated successfully!")
      }
    } catch (error) {
      console.error("Image upload error:", error)
      Alert.alert("Error", "Failed to update profile image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title={"Profile"}
        showProfile={false}
      />
      <View style={styles.mainContainer}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : require("../../assets/images/profile.png")
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={pickImage}
              disabled={isUploading}
              activeOpacity={0.7}>
              {isUploading ? (
                <ActivityIndicator
                  size='small'
                  color={Colors.primary}
                />
              ) : (
                <MaterialIcons
                  name='camera-alt'
                  size={16}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.username || "Vivek"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Actions</Text>

          <View style={styles.actionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={action.onPress}
                activeOpacity={0.7}>
                <View style={styles.iconContainer}>{action.icon}</View>
                <Text style={styles.actionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title={"Logout"}
          onPress={handlePress}
          color={Colors.red}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
  mainContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontFamily: "poppins-medium",
    fontSize: 24,
    color: Colors.darkText,
    marginBottom: 4,
  },
  email: {
    fontFamily: "poppins-regular",
    fontSize: 16,
    color: Colors.grayText,
  },
  quickActionsContainer: {
    marginTop: 40,
  },
  quickActionsTitle: {
    fontFamily: "poppins-medium",
    fontSize: 18,
    color: Colors.darkText,
    marginBottom: 20,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  actionButton: {
    width: "48%",
    alignItems: "center",
    backgroundColor: Colors.transparent,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    color: Colors.darkText,
    textAlign: "center",
  },
  logoutContainer: {
    marginBottom: 50,
  },
})

export default Profile
