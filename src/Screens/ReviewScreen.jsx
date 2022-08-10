import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { logout, requestAPI } from "../Utils/Utils";
import { Loader } from "../Loader/Loader";
import { Card, Button, Dialog, Input } from "react-native-elements";
import { LoginContext } from "../Context/LoginContextProvider";

const PasswordCheckDialogBox = ({
  isVisible,
  setIsVisible,
  password,
  setPassword,
  handleSubmit,
  isBalanceModal,
  addWalletBalance,
}) => {
  const handleCancel = () => {
    setPassword("");
    setIsVisible(false);
  };
  return (
    <Dialog isVisible={isVisible}>
      <Text>Confirm Password:</Text>
      <Input
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholder="Password.."
        errorStyle={{ color: "red" }}
        errorMessage={password.length === 0 ? "Confirm your password!" : null}
        style={{ padding: 0 }}
      />
      <Dialog.Actions>
        <Dialog.Button title="Cancel" onPress={handleCancel} />
        <Dialog.Button
          title="Confirm"
          onPress={isBalanceModal ? addWalletBalance : handleSubmit}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

const AddBalanceModal = ({
  isVisible,
  setIsVisible,
  balance,
  setBalance,
  setIsBalanceModal,
  setIsPasswordModalOpen,
}) => {
  const handleContinue = () => {
    setIsBalanceModal(true);
    setIsVisible(false);
    setIsPasswordModalOpen(true);
  };
  return (
    <Dialog isVisible={isVisible}>
      <View>
        <Text>Enter Amount to add:</Text>
      </View>
      <View>
        <Input
          value={balance}
          onChangeText={(text) => setBalance(text.replace(/[^0-9]/g, ""))}
          placeholder="Amount..."
          errorStyle={{ color: "red" }}
          errorMessage={balance < 10 ? "Enter Valid amount!" : null}
          style={{ padding: 0 }}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title="Continue"
        onPress={handleContinue}
      />
      <Dialog.Actions>
        <Dialog.Button title="Cancel" onPress={() => setIsVisible(false)} />
      </Dialog.Actions>
    </Dialog>
  );
};

const WalletCheckDialogBox = ({
  isVisible,
  setIsVisible,
  setIsAddBalanceModalOpen,
}) => {
  const handleSubmit = () => {
    setIsVisible(false);
    setIsAddBalanceModalOpen(true);
  };
  return (
    <Dialog isVisible={isVisible}>
      <View>
        <Text>Insufficient wallet balance!</Text>
      </View>
      <Button
        containerStyle={styles.button}
        title="Add Balance & Continue"
        onPress={handleSubmit}
      />
      <Dialog.Actions>
        <Dialog.Button title="Cancel" onPress={() => setIsVisible(false)} />
      </Dialog.Actions>
    </Dialog>
  );
};

export default function ReviewScreen({ route, navigation }) {
  const { user, bus, selectedSeat, Passengers } = route.params;
  const [price, setPrice] = useState("");
  const [wallet, setWallet] = useState("");
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [isLessBalanceModalOpen, setIsLessBalanceModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  const [isBalanceModal, setIsBalanceModal] = useState(false);
  const [balance, setBalance] = useState("");
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;

  const handleSubmit = () => {
    if (password !== "") {
      setIsPasswordModalOpen(false);
      setPassword("");
      setLoader(true);
      let data = {
        busId: bus.id,
        journeyDate: user.journeyDate,
        fare: price,
        password,
        seats: selectedSeat,
        passengers: Passengers,
        userType: "Normal",
      };
      requestAPI("POST", "/bookticket", data, null)
        .then((res) => {
          setLoader(false);
          navigation.navigate("ticket", { state: res.data });
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
    }
  };

  const addWalletBalance = () => {
    if (balance !== "" && password !== "") {
      setIsPasswordModalOpen(false);
      setLoader(true);
      let data = {
        money: balance,
        password,
      };
      requestAPI("PUT", "/addMoney", data, null)
        .then((res) => {
          setLoader(false);
          setWallet(res.data.money);
          setBalance("");
          handleSubmit();
        })
        .catch((err) => {
          setLoader(false);
          setBalance("");
          setPassword("");
          if (err?.response?.data?.message === "Authentication Failed.") {
            logout();
            setIsLoggedIn(false);
            navigation.navigate("Login");
          }
        });
    }
  };

  useEffect(() => {
    setPrice(bus.fare * selectedSeat.length);
    setLoader(true);
    requestAPI("GET", "/getwallet", null, null)
      .then((res) => {
        setLoader(false);
        setWallet(res.data.walletBalance);
      })
      .catch((err) => {
        setLoader(false);
        if (err.response.data.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });
  }, [bus]);

  const checkBooking = () => {
    if (price > wallet) {
      setIsLessBalanceModalOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <ScrollView>
        <Card key={bus.busNumber}>
          <Text style={styles.heading}>Bus Number: {bus.busNumber}</Text>
          <Text style={styles.data}>Bus Type: {user.busType}</Text>
          <Text style={styles.data}>Journey Class: {user.journeyClass}</Text>
          <Text style={styles.data}>Journey Date: {user.journeyDate}</Text>
          <Text style={styles.data}>Origin: {user.origin}</Text>
          <Text style={styles.data}>Deaparture Time: {bus.departureTime}</Text>
          <Text style={styles.data}>Destination: {user.destination}</Text>
          <Text style={styles.data}>Arrival Time: {bus.arrivalTime}</Text>
          <Text style={styles.data}>Distance: {bus.distance}KM</Text>
          <Text style={styles.data}>Journey Time: {bus.journeyTime}</Text>
          <Text style={styles.data}>Tickets Booked: {selectedSeat.length}</Text>
          <Text style={styles.data}>
            Booked Seats: {selectedSeat.join(", ")}
          </Text>
          <Text style={styles.data}>Total Fare: ₹{price}</Text>

          <View>
            <Text style={[styles.heading, { marginVertical: 10 }]}>
              Passenger(s) Details:
            </Text>
            {Passengers.map((one, i) => {
              return (
                <View key={one.name} style={styles.passengerStyle}>
                  <Text style={{ fontSize: 20 }}>{`Passenger: ${i + 1}`}</Text>
                  <Text style={styles.data}>Name: {one.name}</Text>
                  <Text style={styles.data}>Age: {one.age}</Text>
                  <Text style={styles.data}>Gender: {one.gender}</Text>
                </View>
              );
            })}
          </View>

          <View>
            <Text style={[styles.heading, { marginVertical: 10 }]}>
              Payment:
            </Text>
            <Text style={styles.data}>
              Current Balance in Wallet: ₹{wallet}
            </Text>
            <Text style={styles.data}>Amount to be deducted: ₹{price}</Text>
          </View>
          <Button title="Book" onPress={checkBooking} />
        </Card>
      </ScrollView>
      <PasswordCheckDialogBox
        handleSubmit={handleSubmit}
        addWalletBalance={addWalletBalance}
        isVisible={isPasswordModalOpen}
        setIsVisible={setIsPasswordModalOpen}
        password={password}
        setPassword={setPassword}
        isBalanceModal={isBalanceModal}
      />
      <WalletCheckDialogBox
        isVisible={isLessBalanceModalOpen}
        setIsVisible={setIsLessBalanceModalOpen}
        setIsAddBalanceModalOpen={setIsAddBalanceModalOpen}
      />
      <AddBalanceModal
        isVisible={isAddBalanceModalOpen}
        setIsVisible={setIsAddBalanceModalOpen}
        balance={balance}
        setBalance={setBalance}
        setIsBalanceModal={setIsBalanceModal}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
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
