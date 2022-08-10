import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FilterBusScreen } from "../Screens/FilterBusScreen";
import { BusList } from "../Screens/BusList";
import PassengersDetails from "../Screens/PassengersDetails";
import ReviewScreen from "../Screens/ReviewScreen";
import BookedTicketScreen from "../Screens/BookedTicketScreen";
import { Foundation } from "@expo/vector-icons";

export default function HomeNavigator({ navigation }) {
  const Stack = createNativeStackNavigator();

  const globalScreen = {
    headerStyle: { backgroundColor: "#2C6BED" },
    headerTitleStyle: { color: "white", alignSelf: "center" },
    headerTitleAlign: "center",
    headerLeft: () => {
      return (
        <Foundation
          style={{ marginLeft: 12 }}
          name="list"
          size={24}
          color="white"
          onPress={() => navigation.toggleDrawer()}
        />
      );
    },
  };

  const homeScreen = {
    title: "",
    headerTitleAlign: "center",
  };

  return (
    <Stack.Navigator screenOptions={globalScreen} initialRouteName="filter">
      <Stack.Screen options={homeScreen} name="filter">
        {(props) => (
          <FilterBusScreen {...props} drawerNavigation={navigation} />
        )}
      </Stack.Screen>
      <Stack.Screen
        options={{
          headerTitle: "Buslist",
        }}
        name="BusList"
        component={BusList}
      />
      <Stack.Screen
        options={{
          headerTitle: "Passenger(s) Details",
        }}
        name="passengers"
        component={PassengersDetails}
      />
      <Stack.Screen
        options={{
          headerTitle: "Review Details",
        }}
        name="review"
        component={ReviewScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "Booked Ticket",
        }}
        name="ticket"
        component={BookedTicketScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
