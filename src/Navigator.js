import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { LoginContext } from "./Context/LoginContextProvider";
import AppDrawer from "./Drawer/AppDrawer";
import AuthNavigator from "./Navigators/AuthNavigator";

export default function Navigator() {
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppDrawer /> : <AuthNavigator />}
      {/* <AuthNavigator /> */}
    </NavigationContainer>
  );
}
