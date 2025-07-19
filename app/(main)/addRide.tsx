import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import TextInputField from "../components/TextInputField";
import RoomNumber from "../assets/icons/roomNum.svg";
import Phone from "../assets/icons/phone.svg";
import CustomDropdown from "../components/CustomDropDown";
import Colors from "../constants/Colors";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grapes", value: "grapes" },
];

const AddRide = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicle, setVehicle] = useState("");

  return (
    <View style={styles.container}>
      <Header title={"Add Ride"} />

      <View style={styles.mainContainer}>
        <TextInputField
          placeholder='Enter Room Number'
          value={roomNumber}
          onChangeText={setRoomNumber}>
          <RoomNumber
            height={25}
            width={25}
          />
        </TextInputField>

        <TextInputField
          placeholder='Enter Phone Number'
          value={phoneNumber}
          onChangeText={setPhoneNumber}>
          <Phone
            height={25}
            width={25}
          />
        </TextInputField>

        <CustomDropdown
          placeholder='Select Vehicle'
          data={options}
          onSelect={setVehicle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 30,
  },
  mainContainer: {
    gap: 20,
  },
});

export default AddRide;
