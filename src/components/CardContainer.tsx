import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";

// Import SVG icons directly
import AddRideIcon from "../assets/icons/addride.svg";
import AllRidesIcon from "../assets/icons/allrides.svg";
import EarningsIcon from "../assets/icons/myearnings.svg";
import QrIcon from "../assets/icons/myqr.svg";
import { useRouter } from "expo-router";

const CardsData = [
  {
    title: "Add\nRide",
    Icon: AddRideIcon,
    color: "#005B76",
    route: "/(main)/addRide",
  },
  {
    title: "All\nRide",
    Icon: AllRidesIcon,
    color: "#FF4B4B",
    route: "/(main)/allRides",
  },
  {
    title: "My\nEarnings",
    Icon: EarningsIcon,
    color: "#F736B3",
    route: "/(main)/allRides",
  },
  {
    title: "My\nQr",
    Icon: QrIcon,
    color: "#7F36F7",
    route: "/(main)/qr",
  },
];

const CardContainer = () => {
  const router = useRouter();

  return (
    <View style={styles.cardContainer}>
      {CardsData.map((item, index) => {
        return (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            key={index}
            onPress={() => {
              router.push(item.route);
            }}>
            <Text
              style={styles.cardText}
              numberOfLines={2}
              ellipsizeMode='clip'>
              {item.title}
            </Text>
            <item.Icon
              height={90}
              width={90}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flexDirection: "row",
    width: "48%",
    borderRadius: 18,
    padding: 10,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  cardText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "poppins-semibold",
    flexShrink: 1,
  },
});

export default CardContainer;
