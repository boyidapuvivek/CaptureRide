import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  View,
  Image,
} from "react-native";
import TopBar from "../components/TopBar";
import MainLayout from "./MainLayout";
import { getRides, addRide } from "../api/rideService";
import AddImageCard from "../components/addRide/AddImageCard";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddRide = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectBike, setBike] = useState("");
  const [aadharImage, setAadharImage] = useState(null);
  const [dlImage, setDlImage] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [image, setImage] = useState(null);
  const [data, setData] = useState();

  useEffect(() => {
    if (route.params?.imageURL && route.params?.imageName) {
      if (route.params?.imageName === "aadharImage") {
        setAadharImage(route.params?.imageURL);
      } else if (route.params?.imageName === "dlImage") {
        setDlImage(route.params?.imageURL);
      } else {
        setUserImage(route.params?.imageURL);
      }
    }
  }, [route.params?.imageURL, route.params?.imageName]);

  const handleAddData = async () => {
    const rideData = { room, name, phoneNumber, selectBike };
    const result = await addRide(rideData);
    console.log(result);

    if (result) {
      setRoom("");
      setBike("");
      setName("");
      setPhoneNumber("");
      alert("Data Has Been Entered");
    }
  };

  return (
    <MainLayout>
      <TopBar title={"Add Ride"} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
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

          <AddImageCard
            title={aadharImage ? "Uploaded!!!" : "Upload Aadhar"}
            imageName={"aadharImage"}
          />
          <AddImageCard
            title={dlImage ? "Uploaded!!!" : "Upload DL"}
            imageName={"dlImage"}
          />
          <AddImageCard
            title={userImage ? "Uploaded!!!" : "Upload Photo"}
            imageName={"userImage"}
          />
          <Button title="Add Ride" onPress={handleAddData} />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  textinput: {
    height: 50,
    width: "80%",
    marginBottom: 20,
    borderColor: "#000000",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddRide;
