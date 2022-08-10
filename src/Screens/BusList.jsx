import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Card, Button, Dialog } from "react-native-elements";
import { SeatSelectionScreen } from "./SeatSelectionScreen";

export const BusList = ({ route, navigation }) => {
  const { buses, user } = route.params.data;
  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState([]);

  const handleBook = (bus) => {
    setShowModal(true);
    setSelectedBus(bus);
  };

  return (
    <View>
      <ScrollView>
        {buses.map((bus) => {
          let total = 0;
          let available = 0;
          for (const key in bus.availableTickets) {
            total += 1;
            if (bus.availableTickets[key] === "false") {
              available += 1;
            }
          }
          return (
            <Card key={bus.busNumber}>
              <Text style={styles.heading}>Bus Number: {bus.busNumber}</Text>
              <Text style={styles.data}>Bus Type: {user.busType}</Text>
              <Text style={styles.data}>
                Journey Class: {user.journeyClass}
              </Text>
              <Text style={styles.data}>Journey Date: {user.journeyDate}</Text>
              <Text style={styles.data}>Origin: {user.origin}</Text>
              <Text style={styles.data}>
                Deaparture Time: {bus.departureTime}
              </Text>
              <Text style={styles.data}>Destination: {user.destination}</Text>
              <Text style={styles.data}>Arrival Time: {bus.arrivalTime}</Text>
              <Text style={styles.data}>Distance: {bus.distance}KM</Text>
              <Text style={styles.data}>Journey Time: {bus.journeyTime}</Text>
              <Text style={styles.data}>Total Seats: {total}</Text>
              <Text style={styles.data}>Available Seats: {available}</Text>
              <Text style={styles.data}>Fare: ₹{bus.fare}</Text>

              <Button title="Book" onPress={() => handleBook(bus)} />
            </Card>
          );
        })}
      </ScrollView>
      <SeatSelectionScreen
        bus={selectedBus}
        user={user}
        isVisible={showModal}
        setIsVisible={setShowModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
  },
  data: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5,
  },
});
