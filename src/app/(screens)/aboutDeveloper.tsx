import React from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import Colors from "../../constants/Colors"
import { FontAwesome } from "@expo/vector-icons"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"

const AboutDeveloper = () => {
  const handleLinkPress = (url) => {
    Linking.openURL(url)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      {/* Profile Section */}
      <Header
        title={"About Developer"}
        showProfile={false}
      />
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/developer.png")} // Replace with your pic
          style={styles.profileImage}
        />
        <Text style={styles.name}>Venkat Vivek Boyidapu</Text>
        <Text style={styles.role}>Full Stack Web & Mobile Developer</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        I am a passionate developer with experience in building scalable web and
        mobile applications. Skilled in React Native, Next.js, Node.js, and
        MongoDB. I enjoy creating modern, user-friendly interfaces and robust
        backend solutions.
      </Text>

      {/* Tech Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technologies and Tools</Text>
        <Text style={styles.techItem}>
          C/C++, JavaScript, TypeScript, Python{"\n"}
          React.js, Next.js, React Native{"\n"}
          Node.js, Express.js, MongoDB{"\n"}
          Docker, Postman, Figma, TablePlus
        </Text>
      </View>

      {/* Social Links */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleLinkPress("https://github.com/boyidapuvivek")}>
          <FontAwesome
            name='github'
            size={20}
            color={Colors.white}
          />
          <Text style={styles.socialText}>GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: Colors.primary }]}
          onPress={() =>
            handleLinkPress("https://linkedin.com/in/boyidapuvivek")
          }>
          <FontAwesome
            name='linkedin'
            size={20}
            color={Colors.white}
          />
          <Text style={styles.socialText}>LinkedIn</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 12,
    marginTop: 40,
  },
  name: {
    fontSize: 22,
    fontFamily: "poppins-bold",
    color: Colors.darkText,
  },
  role: {
    fontSize: 16,
    color: Colors.grayText,
    fontFamily: "poppins-regular",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: "poppins-regular",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "poppins-semibold",
    color: Colors.primaryText,
    marginBottom: 8,
  },
  techItem: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: "poppins-regular",
    lineHeight: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  socialText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "poppins-semibold",
    marginLeft: 8,
  },
})

export default AboutDeveloper
