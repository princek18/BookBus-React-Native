import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Dialog } from "react-native-elements";
import {
  logout,
  PasswordCheckDialogBox,
  requestAPI,
  ResponseModal,
} from "../Utils/Utils";
import { LoginContext } from "../Context/LoginContextProvider";
import { Loader } from "../Loader/Loader";

export default function WalletBalanceScreen({ navigation }) {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseModal, setIsResponseModal] = useState(false);
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;

  useEffect(() => {
    setLoader(true);
    requestAPI("GET", "/getwallet", null, null)
      .then((res) => {
        setLoader(false);
        setWallet(res.data.walletBalance);
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
  }, []);

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
          setBalance("");
          setPassword("");
          setWallet(res.data.money);
        })
        .catch((err) => {
          setLoader(false);
          setBalance("");
          setPassword("");
          setResponseMessage(err?.response?.data?.message);
          setIsResponseModal(true);
          if (err?.response?.data?.message === "Authentication Failed.") {
            logout();
            setIsLoggedIn(false);
            navigation.navigate("Login");
          }
        });
    }
  };
  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <View style={styles.inputWrapper}>
        <Text style={styles.heading}>Available Balance:</Text>
        <Text style={styles.heading}>₹{wallet}</Text>
        <Input
          value={balance}
          onChangeText={(text) => setBalance(text.replace(/[^0-9]/g, ""))}
          placeholder="Amount.."
          errorStyle={{ color: "red" }}
          responseMessage={balance < 10 ? "Enter valid amount!" : null}
        />
        <Button
          containerStyle={styles.button}
          title="Add Balance"
          disabled={balance > 10 ? false : true}
          onPress={() => setIsPasswordModalOpen(true)}
        />
      </View>
      <PasswordCheckDialogBox
        isVisible={isPasswordModalOpen}
        setIsVisible={setIsPasswordModalOpen}
        password={password}
        setPassword={setPassword}
        handleConfirm={addWalletBalance}
      />
      <ResponseModal
        message={responseMessage}
        isVisible={isResponseModal}
        setIsVisible={setIsResponseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  heading: {
    fontSize: 18,
    marginVertical: 5,
  },
  button: {
    margin: 10,
  },
});
