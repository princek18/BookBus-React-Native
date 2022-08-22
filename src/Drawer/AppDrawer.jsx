import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { LoginContext } from "../Context/LoginContextProvider";
import HomeNavigator from "../Navigators/HomeNavigator";
import { BookedTicketListScreen } from "../Screens/BookedTicketListScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import WalletBalanceScreen from "../Screens/WalletBalanceScreen";
import { logout } from "../Utils/Utils";

const Drawer = createDrawerNavigator();

const globalScreen = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTitleAlign: "center",
  headerTintColor: "white",
};

export default function AppDrawer() {
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;
  const navigation = useNavigation();
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigation.navigate("Login");
  };
  return (
    <Drawer.Navigator
      screenOptions={globalScreen}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={handleLogout} />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeNavigator}
      />
      <Drawer.Screen
        name="Booked"
        options={{
          title: "My Bookings",
        }}
        component={BookedTicketListScreen}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Wallet" component={WalletBalanceScreen} />
    </Drawer.Navigator>
  );
}
