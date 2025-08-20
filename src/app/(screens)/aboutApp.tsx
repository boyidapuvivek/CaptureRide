import React from "react"
import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import Colors from "../../constants/Colors"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"

const AboutApp = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <Header
        title={"About App"}
        showProfile={false}
      />
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icon.png")} // replace with your app logo
          style={styles.logo}
        />
        <Text style={styles.appName}>Capture Ride</Text>
      </View>

      {/* App Description */}
      <Text style={styles.description}>
        Capture Ride is a full-stack mobile application designed for bike rental
        agencies. It helps vendors manage customer details, verify documents,
        and track rides seamlessly. The app integrates React Native on the
        frontend with a Node.js, Express.js, and MongoDB backend for smooth and
        secure data flow.
      </Text>

      {/* How to Use */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use the App</Text>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            Add your <Text style={styles.highlight}>bikes data</Text> to the
            system for rentals.
          </Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Create <Text style={styles.highlight}>ride entries</Text> for each
            customer.
          </Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            Capture and upload{" "}
            <Text style={styles.highlight}>QR code and document images</Text>{" "}
            (Aadhar, Driving License, etc).
          </Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>
            Update your <Text style={styles.highlight}>profile</Text> and manage
            all rides with ease.
          </Text>
        </View>
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
    paddingTop: Values.paddingTop,
    paddingHorizontal: Values.paddingHorizontal,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
    borderRadius: 80,
    marginTop: 30,
  },
  appName: {
    fontSize: 24,
    fontFamily: "poppins-bold",
    color: Colors.primaryText,
  },
  description: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "poppins-semibold",
    color: Colors.primary,
    marginBottom: 15,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  stepNumber: {
    backgroundColor: Colors.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: Colors.white,
    fontFamily: "poppins-bold",
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkText,
    lineHeight: 20,
  },
  highlight: {
    color: Colors.primaryText,
    fontFamily: "poppins-semibold",
  },
})

export default AboutApp
