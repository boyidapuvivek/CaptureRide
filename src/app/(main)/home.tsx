import React, { useState, useCallback } from "react"
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
const { width, height } = Dimensions.get("window")
import { StatusBar } from "react-native"
import Colors from "../../constants/Colors"
import { useAuth } from "../../contexts/AuthContext"
import CardContainer from "../../components/CardContainer"
import RecentRides from "../../components/RecentRides"
import { useRouter } from "expo-router"
import { Values } from "../../constants/Values"

const HomeScreen = () => {
  const user = useAuth()
  const router = useRouter()

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return "Good Morning!"
    } else if (hour < 17) {
      return "Good Afternoon!"
    } else {
      return "Good Evening!"
    }
  }

  return (
    <View style={styles.container}>
      {/* <StatusBar translucent /> */}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.blueSection} />

        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                router.push("/(screens)/profile")
              }}>
              {!user?.user?.avatar ? (
                <Image
                  source={require("../../assets/images/profile.png")}
                  style={styles.profileimg}
                />
              ) : (
                <Image
                  source={{ uri: user?.user?.avatar }}
                  style={styles.profileimg}
                />
              )}
            </TouchableOpacity>
            <View style={{ gap: 5 }}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.user?.username}</Text>
            </View>
          </View>
          <CardContainer />
        </View>

        {/* Recent Rides Section */}
        <RecentRides />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: Colors.background,
  },

  blueSection: {
    height: height * 0.34,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: -height * 0.28,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  mainContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    gap: 30,
    marginBottom: 40, // Add some spacing before recent rides
    zIndex: 1, // Ensure content appears above the blue section
  },

  profileimg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  greeting: {
    fontFamily: "poppins-semibold",
    fontSize: 20,
    lineHeight: 22,
    color: Colors.white,
  },

  userName: {
    fontFamily: "poppins-regular",
    fontSize: 16,
    lineHeight: 22,
    color: Colors.white,
  },
})

export default HomeScreen
