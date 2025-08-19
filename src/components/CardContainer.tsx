import React from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native"
import Colors from "../constants/Colors"
import AddRideIcon from "../assets/icons/addride.svg"
import AllRidesIcon from "../assets/icons/allrides.svg"
import AddBikeIcon from "../assets/icons/addbike.svg"
import QrIcon from "../assets/icons/myqr.svg"
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window")

const CARD_SPACING = 12
const CARD_WIDTH = width / 2.5 // 2 per row

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
    title: "Add\nBike",
    Icon: AddBikeIcon,
    color: "#F736B3",
    route: "/(screens)/myBikes",
  },
  {
    title: "My\nQr's",
    Icon: QrIcon,
    color: "#7341c2ff",
    route: "/(main)/qr",
  },
]

const CardContainer = () => {
  const router = useRouter()

  return (
    <View style={styles.cardContainer}>
      {CardsData.map((item, index) => {
        const IconSize = width < 380 ? 60 : 80 // smaller phones vs larger
        return (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            key={index}
            onPress={() => router.push(item.route)}
            activeOpacity={0.9}>
            <Text
              style={[
                styles.cardText,
                { fontSize: width < 380 ? 14 : 16 }, // responsive font
              ]}>
              {item.title}
            </Text>
            <item.Icon
              height={IconSize}
              width={IconSize}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: CARD_SPACING,
  },
  card: {
    flexBasis: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    marginBottom: CARD_SPACING,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    color: Colors.white,
    fontFamily: "poppins-semibold",
    flexShrink: 1,
  },
})

export default CardContainer
