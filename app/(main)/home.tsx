import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { StatusBar } from "react-native";
import Colors from "../constants/Colors";
import { useAuth } from "../contexts/AuthContext";
import CardContainer from "../components/CardContainer";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const user = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        hidden
      />

      <View style={styles.blueSection} />

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.push("/(screens)/profile");
            }}>
            <Image
              source={require("../assets/images/profile.png")}
              style={styles.profileimg}
            />
          </TouchableOpacity>
          <View style={{ gap: 5 }}>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>{user.user.username}</Text>
          </View>
        </View>
        <CardContainer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  blueSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.32,
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 50,
    gap: 60,
  },

  profileimg: {
    height: 60,
    width: 60,
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
});

export default HomeScreen;
