import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Card, Button, Dialog } from "react-native-elements";
import { LoginContext } from "../Context/LoginContextProvider";
import { Loader } from "../Loader/Loader";
import { logout, requestAPI, ResponseModal } from "../Utils/Utils";

export const BookedTicketListScreen = ({ navigation }) => {
  const [resData, setResData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseModal, setIsResponseModal] = useState(false);
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;

  useEffect(() => {
    AsyncStorage.getItem("userId").then((userId) => {
      setLoader(true);
      requestAPI("POST", "/getallticket", { userId }, null)
        .then((res) => {
          setLoader(false);
          setResData(res.data);
        })
        .catch((err) => {
          setLoader(false);
          setResponseMessage(err?.response?.data?.message);
          setIsResponseModal(true);
          if (err?.response?.data?.message === "Authentication Failed.") {
            logout();
            setIsLoggedIn(false);
            navigation.navigate("Login");
          }
        });
    });
  }, []);

  const handleBook = (ticketId) => {
    navigation.navigate("ticket", { state: { ticketId } });
  };

  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <ScrollView>
        {resData.map((tkt) => {
          return (
            <Card key={tkt._id}>
              <Text style={styles.heading}>Bus Number: {tkt.busNumber}</Text>
              <Text style={styles.data}>Journey Date: {tkt.journeyDate}</Text>
              <Text style={styles.data}>Origin: {tkt.origin}</Text>
              <Text style={styles.data}>Destination: {tkt.destination}</Text>
              <Text style={styles.data}>Fare: ₹{tkt.fare}</Text>
              <Text>Passenger(s): {tkt.passengers?.length}</Text>

              <Button title="Open Ticket" onPress={() => handleBook(tkt._id)} />
            </Card>
          );
        })}
      </ScrollView>
      <ResponseModal
        isVisible={isResponseModal}
        setIsVisible={setIsResponseModal}
        message={responseMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
  },
  data: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5,
  },
});
