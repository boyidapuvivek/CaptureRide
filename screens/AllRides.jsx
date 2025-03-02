import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MainLayout from "./MainLayout";
import TopBar from "../components/TopBar";
import { getRides } from "../api/rideService";

const AllRides = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const res = await getRides();
    setData(res);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MainLayout>
      <TopBar title={"All Rides"} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {data?.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.rideItem}>
                <Text>Name : {item?.name}</Text>
                <Text>Room Number: {item?.room}</Text>
                <Text>Phone Number : {item?.phoneNumber}</Text>
                <Text>Bike : {item?.selectBike}</Text>
              </View>
            ))
          ) : (
            <Text>No rides available</Text>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  rideItem: {
    height: "auto",
    width: 250,
    backgroundColor: "#F1F1F1",
    marginBottom: 10,
    padding: 20,
    borderRadius: 20,
  },
  scroll: {
    marginBottom: 20,
  },
});

export default AllRides;
