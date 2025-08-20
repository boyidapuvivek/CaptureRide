// profile.tsx
import React, { useState, useEffect } from "react"
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import CustomButton from "../../components/CustomButton"
import { AuthProvider, useAuth } from "../../contexts/AuthContext"
import { useRouter } from "expo-router"
import Colors from "../../constants/Colors"
import { Values } from "../../constants/Values"
import Header from "../../components/Header"
import axios from "axios"
import Edit from "../../assets/icons/allRides/edit.svg"
import Bike from "../../assets/icons/scooter.svg"
import Info from "../../assets/icons/info.svg"
import Dev from "../../assets/icons/dev.svg"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from "../../utils/imagePickerUtils"
import ImagePickerModal from "../../components/ImagePickerModal"
import Camera from "../../assets/icons/camera.svg"

const Profile = () => {
  const { logout, user, updateUser } = useAuth()
  const router = useRouter()
  const token = useFetchToken()
  const [isUploading, setIsUploading] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)

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
      onPress: () => {
        router.push("/(screens)/editProfile")
      },
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
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.status !== 200) throw new Error("Failed user logout!!")

      await logout("user logged out")
      router.replace("/(auth)/login")
    } catch (error) {
      Alert.alert("Error", "Failed user logout!!")
    }
  }

  const handlePick = async (source: "camera" | "gallery") => {
    if (isUploading) return
    try {
      let result =
        source === "camera"
          ? await pickImageFromCamera({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await pickImageFromGallery({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })

      if (result.success && result.uri) {
        await uploadImage(result.uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.")
    }
  }

  const uploadImage = async (imageUri: string) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("avatar", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any)

      const response = await axios.patch(apiRoute.ADDPROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 && updateUser) {
        updateUser({ ...user, avatar: response.data.user.avatar })
        Alert.alert("Success", "Profile image updated successfully!")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile image.")
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
              onPress={() => setPickerVisible(true)}
              disabled={isUploading}
              activeOpacity={0.7}>
              {isUploading ? (
                <ActivityIndicator
                  size='small'
                  color={Colors.primary}
                />
              ) : (
                <Camera
                  height={16}
                  width={16}
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

      {/* Modern Picker Modal */}
      <ImagePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPickCamera={() => handlePick("camera")}
        onPickGallery={() => handlePick("gallery")}
      />
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
  mainContainer: { flex: 1 },
  profileSection: { alignItems: "center", marginTop: 20 },
  profileImageContainer: { position: "relative", marginBottom: 16 },
  profileImage: { height: 120, width: 120, borderRadius: 60 },
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
  quickActionsContainer: { marginTop: 30 },
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: Colors.transparent,
    shadowColor: "#000",
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
  logoutContainer: { marginBottom: 50 },
})

export default Profile
