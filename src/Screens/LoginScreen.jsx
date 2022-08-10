import { StatusBar, StyleSheet, View, Keyboard } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useState } from "react";
import { Button, Image, Input } from "react-native-elements";
import { requestAPI, ResponseModal } from "../Utils/Utils";
import { Loader } from "../Loader/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../Context/LoginContextProvider";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Normal");
  const [loader, setLoader] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseModal, setIsResponseModal] = useState(false);
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;

  const sigIn = () => {
    Keyboard.dismiss();
    if (email.length < 3 || password.length < 5) {
      return;
    }
    const values = {
      email,
      password,
      userType,
    };
    setLoader(true);
    requestAPI("POST", "/login", values, null)
      .then(async (res) => {
        setLoader(false);
        await AsyncStorage.setItem("authToken", res.data.authToken);
        await AsyncStorage.setItem(
          "name",
          res.data.user.firstName + " " + res.data.user.lastName
        );
        await AsyncStorage.setItem("userType", res.data.user.userType);
        setIsLoggedIn(true);
        navigation.navigate("filter");
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setIsResponseModal(true);
      });
  };

  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <StatusBar style="light" />
      <View style={styles.LoginWrapper}>
        <Image
          style={styles.icon}
          source={require("../../assets/logo-red.png")}
        />
        <Input
          value={email}
          type="email"
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          errorStyle={{ color: "red" }}
          style={{ paddingLeft: 0 }}
          errorMessage={email.length === 0 ? "Enter your email!" : null}
        />
        <Input
          value={password}
          type="password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          style={{ padding: 0 }}
          errorStyle={{ color: "red" }}
          errorMessage={password.length === 0 ? "Enter your password!" : null}
        />
      </View>
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        title="Login"
        onPress={sigIn}
      />
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        title="Register"
        type="outline"
        onPress={() => navigation.navigate("Register")}
      />
      <View style={styles.forgot}>
        <Button
          title="Forgot Password?"
          onPress={() => navigation.navigate("forgot")}
        />
      </View>
      <ResponseModal
        isVisible={isResponseModal}
        setIsVisible={setIsResponseModal}
        message={responseMessage}
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
  LoginWrapper: {
    width: "70%",
    alignItems: "center",
  },
  icon: {
    height: 70,
    width: 70,
    marginBottom: 10,
  },
  button: {
    width: 200,
  },
  buttonContainer: {
    padding: 10,
  },
  pickerContainer: {
    width: "96%",
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 5,
  },
  picker: {
    height: 35,
  },
  forgot: {
    position: "absolute",
    bottom: 10,
  },
});
