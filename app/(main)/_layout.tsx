import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import Home from "../assets/icons/home.svg";
import HomeSelect from "../assets/icons/home_selected.svg";
import Ride from "../assets/icons/bike.svg";
import RideSelect from "../assets/icons/bike_selected.svg";
import Doc from "../assets/icons/doc.svg";
import DocSelect from "../assets/icons/docs_selected.svg";
import Qr from "../assets/icons/qr.svg";
import QrSelect from "../assets/icons/qr_selected.svg";

const TabIcon = ({ focused, IconComponent, IconSelectedComponent }) => {
  const Icon = focused ? IconSelectedComponent : IconComponent;
  return (
    <Icon
      width={24}
      height={24}
    />
  );
};

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.transparent,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "poppins-semibold",
          textAlign: "center",
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // paddingVertical: 10,
        },

        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={1}
            style={[
              props.style,
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          />
        ),
      }}>
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Home}
              IconSelectedComponent={HomeSelect}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='addRide'
        options={{
          title: "Add Ride",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Ride}
              IconSelectedComponent={RideSelect}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='allRides'
        options={{
          title: "All Rides",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Doc}
              IconSelectedComponent={DocSelect}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='qr'
        options={{
          title: "QR Codes", // Fixed apostrophe usage
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              IconComponent={Qr}
              IconSelectedComponent={QrSelect}
            />
          ),
        }}
      />
    </Tabs>
  );
}
