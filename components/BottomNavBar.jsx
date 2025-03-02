import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import images from "../constants/Images";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

function BottomNavBar() {
  const navigation = useNavigation();
  const [fontLoaded] = useFonts({
    "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });
  if (!fontLoaded) {
    return null;
  }

  const handleNavigation = (route) => {
    if (route === "home") {
      navigation.navigate("Home");
    } else if (route === "addride") {
      navigation.navigate("AddRide");
    } else if (route === "allrides") {
      navigation.navigate("AllRides");
    } else if (route === "qr") {
      navigation.navigate("Qr");
    }
  };

  return (
    <View style={styles.bottomRow}>
      <TouchableOpacity
        onPress={() => {
          handleNavigation("home");
        }}
      >
        <View style={styles.box}>
          <Image source={images.bottomNavBar.Home} style={styles.image} />
          <Text style={styles.text}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleNavigation("addride");
        }}
      >
        <View style={styles.box}>
          <Image source={images.bottomNavBar.Bike} style={styles.image} />
          <Text style={styles.text}>Add Ride</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleNavigation("allrides");
        }}
      >
        <View style={styles.box}>
          <Image source={images.bottomNavBar.Folder} style={styles.image} />
          <Text style={styles.text}>All Rides</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleNavigation("qr");
        }}
      >
        <View style={styles.box}>
          <Image source={images.bottomNavBar.Qr} style={styles.image} />
          <Text style={styles.text}>Qr</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "roboto-bold",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default BottomNavBar;
