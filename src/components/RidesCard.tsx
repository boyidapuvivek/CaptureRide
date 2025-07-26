import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import Number from "../assets/icons/roomNum.svg";
import Phone from "../assets/icons/phone.svg";
import Edit from "../assets/icons/allRides/edit.svg";
import Share from "../assets/icons/allRides/share.svg";
import Call from "../assets/icons/allRides/call.svg";

const RidesCard = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/sampleProfile.png")}
        style={styles.image}
      />
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.customerName}>Ajay Kumar</Text>
          <View style={styles.customerDataField}>
            <View style={styles.dataField}>
              <Number
                height={20}
                width={20}
              />
              <Text style={styles.dataFieldText}>102</Text>
            </View>

            <View style={styles.dataField}>
              <Phone
                height={20}
                width={20}
              />
              <Text style={styles.dataFieldText}>9866028047</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <Pressable>
            <Edit
              height={24}
              width={24}
            />
          </Pressable>
          <Pressable>
            <Share
              height={24}
              width={24}
            />
          </Pressable>
          <Pressable>
            <Call
              height={24}
              width={24}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 18,
    width: "100%",
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",

    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },

  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },

  customerName: {
    fontFamily: "poppins-semibold",
    fontSize: 16,
    color: Colors.black,
  },

  customerDataField: {
    padding: 4,
    justifyContent: "center",
  },
  dataField: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dataFieldText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    textAlign: "center",
    color: Colors.grayText,
  },

  actionButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});

export default RidesCard;
