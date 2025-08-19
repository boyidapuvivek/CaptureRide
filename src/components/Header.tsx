import React from "react"
import { TouchableOpacity, StyleSheet, Text, View } from "react-native"
import BackArrow from "../assets/icons/back.svg"
import Profile from "../assets/icons/profile.svg"
import { useRouter } from "expo-router"
import Colors from "../constants/Colors"

type Props = {
  title: String
  showProfile: boolean
}

const Header = ({ title, showProfile = true }: Props) => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={() => {
            router.back()
          }}>
          <BackArrow
            height={30}
            width={30}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {showProfile && (
        <TouchableOpacity
          onPress={() => {
            router.push("/(screens)/profile")
          }}>
          <Profile
            height={24}
            width={24}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: "poppins-semibold",
    fontSize: 20,
    color: Colors.darkText,
  },
})

export default Header
