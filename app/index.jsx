import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import Home from "../screens/Home";
import Qr from "../screens/Qr";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddRide from "../screens/AddRide";
import AllRides from "../screens/AllRides";

export default function Page() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignUp">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="AddRide"
            component={AddRide}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AllRides"
            component={AllRides}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Qr"
            component={Qr}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
