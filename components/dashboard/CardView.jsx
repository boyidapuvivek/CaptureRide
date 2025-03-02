import React from "react";
import CardBox from "./Card";
import images from "../../constants/Images";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function CardView() {
  const navigation = useNavigation();

  const handelNavigate = (value) => {
    if (value === "addride") {
      navigation.navigate("AddRide");
    } else if (value === "allrides") {
      navigation.navigate("AllRides");
    } else if (value === "qr") {
      navigation.navigate("Qr");
    }
  };

  return (
    <View style={styles.CardsConatiner}>
      <TouchableOpacity
        onPress={() => {
          handelNavigate("addride");
        }}
      >
        <CardBox
          title="ADD RIDE"
          color={"#005B76"}
          image={images.card.AddRide}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handelNavigate("allrides");
        }}
      >
        <CardBox
          title="ALL RIDES"
          color={"#FF4B4B"}
          image={images.card.AllRides}
        />
      </TouchableOpacity>
      <CardBox
        title="TOTAL EARNED"
        color={"#F736B3"}
        image={images.card.MyEarnings}
      />
      <TouchableOpacity
        onPress={() => {
          handelNavigate("qr");
        }}
      >
        <CardBox title="MY QR" color={"#7F36F7"} image={images.card.QR} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  CardsConatiner: {
    display: "flex",
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 40,
  },
});

export default CardView;
