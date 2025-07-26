import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Header from "../../components/Header";
import { Values } from "../../constants/Values";
import RidesCard from "../../components/RidesCard";
import { get } from "../../api/apiClient";
import { apiRoute } from "../../api/apiRoutes";
import { getAccessToken } from "../../utils/authUtils";
import CustomButton from "../../components/CustomButton";
import axios from "axios";

const AllRides = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessToken();
      setToken(t);
    };
    fetchToken();
  }, []);

  const fetchData = async () => {
    if (!token) return;
    console.log(token);

    try {
      const res = await axios.get(
        "http://192.168.1.100:5000/api/v1/ride/getRides",
        {
          params: { page: 1 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res", res);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Header title={"All Rides"} />
      <RidesCard />
      <CustomButton onPress={fetchData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
    gap: 20,
  },
});
export default AllRides;
