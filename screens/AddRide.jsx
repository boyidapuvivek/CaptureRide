import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, Button } from "react-native";
import TopBar from "../components/TopBar";
import MainLayout from "./MainLayout";
import { getRides, addRide } from "../api/rideService";

const AddRide = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectBike, setBike] = useState("");
  const [data, setData] = useState();

  const fetchData = async () => {
    const data = await getRides();
    setData(data);
  };

  const handleAddData = async () => {
    const rideData = { room, name, phoneNumber, selectBike };
    const result = await addRide(rideData);
    console.log(result);

    if (result) {
      fetchData();
      setRoom("");
      setBike("");
      setName("");
      setPhoneNumber("");
      alert("Data Has Been Entered");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <TopBar title={"Add Ride"} />
      <TextInput
        placeholder="enter room number"
        value={room}
        onChangeText={setRoom}
        style={styles.textinput}
      />
      <TextInput
        placeholder="enter name"
        value={name}
        onChangeText={setName}
        style={styles.textinput}
      />
      <TextInput
        placeholder="enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.textinput}
      />
      <TextInput
        placeholder="select bike"
        value={selectBike}
        onChangeText={setBike}
        style={styles.textinput}
      />
      <Button title="Add Ride" onPress={handleAddData} />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  textinput: {
    height: 50,
    width: 350,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
});

export default AddRide;
