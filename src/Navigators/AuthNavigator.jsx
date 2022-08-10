import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import ForgotPasswordScreen from "../Screens/ForgotPasswordScreen";

export default function AuthNavigator() {
  const Stack = createNativeStackNavigator();
  const globalScreen = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white", alignSelf: "center" },
    headerTintColor: "white",
  };
  return (
    <Stack.Navigator screenOptions={globalScreen} initialRouteName="Login">
      <Stack.Screen
        options={{ headerTitleAlign: "center" }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
        }}
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
        }}
        name="forgot"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}
