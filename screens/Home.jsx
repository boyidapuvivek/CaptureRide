import React from "react";
import MainLayout from "./MainLayout";
import CardView from "../components/dashboard/CardView";
import TopBar from "../components/TopBar";

const Home = () => {
  return (
    <MainLayout>
      <TopBar title={"Dashboard"} />
      <CardView />
    </MainLayout>
  );
};

export default Home;
