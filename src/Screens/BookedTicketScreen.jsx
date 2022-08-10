import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { logout, requestAPI, ResponseModal } from "../Utils/Utils";
import { Loader } from "../Loader/Loader";
import { Button, Card } from "react-native-elements";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { LoginContext } from "../Context/LoginContextProvider";

export default function BookedTicketScreen({ route, navigation }) {
  const { state } = route.params;
  const [resData, setResData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [htmldata, setHtmlData] = useState("");
  const [responseModalPopUp, setResponsePopUpModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { state: LoginState } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = LoginState;

  useEffect(() => {
    setLoader(true);
    requestAPI("POST", "/getticket", state, null)
      .then((res) => {
        setLoader(false);
        setResData(res.data);
        let s = "";
        if (res.data.ticket) {
          for (let i = 0; i < res.data.ticket.passengers.length; i++) {
            s += `<br/>
                Name: ${res.data.ticket.passengers[i].name}
                <br/>
                Age: ${res.data.ticket.passengers[i].age}
                <br/>
                Gender: ${res.data.ticket.passengers[i].gender}
                <br/>
                <br/>`;
          }
          setHtmlData(s);
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err?.response?.data?.message);
        if (err?.response?.data?.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });
  }, []);

  const generatePDF = async () => {
    if (resData.ticket && resData.bus) {
      let html = `<html>
  <head>
    <title></title>
  </head>
  <body>
    <div>
      <h1>Bus No: ${resData.bus.busNumber}</h1>
    <div style="display: flex;">
    <div style="margin: 10px 40px 10px 0px;">
    <p>Bus Type: ${resData.bus.busType}</p>
    <p>Origin: ${resData.bus.origin}</p>
    <p>Departure Time: ${resData.bus.departureTime}</p>
    <p>Total Fare: ₹${resData.ticket.fare}</p>
    </div>
    <div style="margin: 10px 40px;">
    <p>Journey Class: ${resData.bus.journeyClass}</p>
    <p>Destination: ${resData.bus.destination}</p>
    <p>Arrival Time: ${resData.bus.arrivalTime}</p>
    </div>
    <div style="margin: 10px 40px;">
    <p>Journey Date: ${resData.ticket.journeyDate}</p>
    <p>Distance: ${resData.bus.distance}KM</p>
    <p>Journey Time: ${resData.bus.journeyTime}</p>
    <p>Seats(s): ${resData.ticket.seats}</p>
    </div>
    </div>
    <h1>Passenger(s) Details:</h1>
    <br/>
    ${htmldata}
    </div>
  </body>
</html>
`;
      const file = await printToFileAsync({
        html: html,
        base64: false,
      });

      await shareAsync(file.uri);
    }
  };

  const sendTicket = () => {
    setLoader(true);
    requestAPI("POST", "/sendtickettoemail", state, null)
      .then((res) => {
        setLoader(false);
        setResponseMessage(res.data.message);
        setResponsePopUpModal(true);
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setResponsePopUpModal(true);
        if (err?.response?.data?.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });
  };

  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <ScrollView>
        {resData.bus && resData.ticket ? (
          <Card key={resData.bus.busNumber}>
            <Text style={styles.heading}>
              Bus Number: {resData.bus.busNumber}
            </Text>
            <Text style={styles.data}>Bus Type: {resData.bus.busType}</Text>
            <Text style={styles.data}>
              Journey Class: {resData.bus.journeyClass}
            </Text>
            <Text style={styles.data}>
              Journey Date: {resData.bus.journeyDate}
            </Text>
            <Text style={styles.data}>Origin: {resData.bus.origin}</Text>
            <Text style={styles.data}>
              Deaparture Time: {resData.bus.departureTime}
            </Text>
            <Text style={styles.data}>
              Destination: {resData.bus.destination}
            </Text>
            <Text style={styles.data}>
              Arrival Time: {resData.bus.arrivalTime}
            </Text>
            <Text style={styles.data}>Distance: {resData.bus.distance}KM</Text>
            <Text style={styles.data}>
              Journey Time: {resData.bus.journeyTime}
            </Text>
            <Text style={styles.data}>
              Seat(s): {resData.ticket.seats.join(", ")}
            </Text>
            <Text style={styles.data}>Total Fare: ₹{resData.ticket.fare}</Text>

            <View>
              <Text style={[styles.heading, { marginVertical: 10 }]}>
                Passenger(s) Details:
              </Text>
              {resData.ticket.passengers.map((one, i) => {
                return (
                  <View key={one.name} style={styles.passengerStyle}>
                    <Text style={{ fontSize: 20 }}>{`Passenger: ${
                      i + 1
                    }`}</Text>
                    <Text style={styles.data}>Name: {one.name}</Text>
                    <Text style={styles.data}>Age: {one.age}</Text>
                    <Text style={styles.data}>Gender: {one.gender}</Text>
                  </View>
                );
              })}
            </View>
            <Button
              containerStyle={styles.button}
              title="BOOK ANOTHER TICKET"
              onPress={() => navigation.navigate("Home", { screen: "filter" })}
            />
            <Button
              onPress={generatePDF}
              containerStyle={styles.button}
              title="PRINT TICKET"
            />
            <Button
              containerStyle={styles.button}
              title="SEND TO EMAIL"
              onPress={sendTicket}
            />
          </Card>
        ) : null}
      </ScrollView>
      <ResponseModal
        isVisible={responseModalPopUp}
        setIsVisible={setResponsePopUpModal}
        message={responseMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
  },
  data: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 5,
  },
  passengerStyle: {
    backgroundColor: "lightgray",
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
  },
});
