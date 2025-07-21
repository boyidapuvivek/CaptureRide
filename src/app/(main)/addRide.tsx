import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";
import TextInputField from "../../components/TextInputField";
import RoomNumber from "../../assets/icons/roomNum.svg";
import Phone from "../../assets/icons/phone.svg";
import CustomDropdown from "../../components/CustomDropDown";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import UploadPhoto from "../../components/UploadPhoto";

const options = [
  { label: "AP16AB1234", id: 1 },
  { label: "TS09CD5678", id: 2 },
  { label: "MH12EF9012", id: 3 },
  { label: "KA05GH3456", id: 4 },
  { label: "DL8CJK7890", id: 5 },
  { label: "TN10LM4321", id: 6 },
  { label: "RJ14NP8765", id: 7 },
  { label: "WB20QR0987", id: 8 },
  { label: "GJ18ST6543", id: 9 },
  { label: "KL07UV3210", id: 10 },
  { label: "PB11WX8765", id: 11 },
  { label: "CG22YZ4321", id: 12 },
  { label: "HR26JK1098", id: 13 },
  { label: "OD02LM7654", id: 14 },
  { label: "MP09QR3456", id: 15 },
  { label: "UP32ST9876", id: 16 },
  { label: "BR01UV5432", id: 17 },
  { label: "UK08WX2109", id: 18 },
  { label: "AS04YZ6789", id: 19 },
  { label: "JH10AB3456", id: 20 },
];

const AddRide = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicle, setVehicle] = useState("");

  return (
    <View style={styles.container}>
      <Header title={"Add Ride"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
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

          <UploadPhoto title='Upload Aadhaar' />

          <UploadPhoto title='Upload DL' />

          <UploadPhoto title='Upload Photo' />

          <CustomButton title={"Upload"} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 30,
    backgroundColor: Colors.white,
  },
  mainContainer: {
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default AddRide;
