import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import MainLayout from "./MainLayout";
import TopBar from "../components/TopBar";

const Qr = () => {
  return (
    <MainLayout>
      <TopBar title={"Qr"} />
    </MainLayout>
  );
};

const style = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Qr;
