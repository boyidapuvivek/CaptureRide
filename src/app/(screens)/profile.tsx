import React from "react"
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native"
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import CustomButton from "../../components/CustomButton"
import { useAuth } from "../../contexts/AuthContext"
import { handleError } from "../../utils/errorHandler"
import { useRouter } from "expo-router"
import Colors from "../../constants/Colors"
import { Values } from "../../constants/Values"
import Header from "../../components/Header"
import axios from "axios"
import { getAccessToken } from "../../utils/authUtils"
import Edit from "../../assets/icons/allRides/edit.svg"
import Bike from "../../assets/icons/scooter.svg"

const Profile = () => {
  const { logout, user } = useAuth()
  const router = useRouter()
  const accessToken = getAccessToken()

  const handlePress = async () => {
    try {
      const res = await axios.post(
        "http://192.168.1.100:5000/api/v1/user/logout",
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
    }
  }

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    router.push("/(screens)/editProfile")
  }

  const handleMyScooters = () => {
    // Navigate to my scooters screen
    router.push("/(screens)/myBikes")
  }

  return (
    <View style={styles.container}>
      <Header title={"Profile"} />
      <View style={styles.mainContainer}>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.username || "Vivek"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditProfile}
              activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <Edit
                  height={24}
                  width={24}
                />
              </View>
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMyScooters}
              activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <Bike
                  height={24}
                  width={24}
                />
              </View>
              <Text style={styles.actionText}>My Bikes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title={"Logout"}
          onPress={handlePress}
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
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 16,
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: "center",
    flex: 0.46,
    backgroundColor: "#F8F9FA",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
