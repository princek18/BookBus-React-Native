import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { requestAPI, ResponseModal } from "../Utils/Utils";
import { Loader } from "../Loader/Loader";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responsePopUp, setResponsePopUp] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Forgot Password",
    });
  }, []);

  const onReset = () => {
    setLoader(true);
    let value = { email };
    requestAPI("POST", "/resetpassword", value, null)
      .then((res) => {
        setLoader(false);
        setResponseMessage(res.data.message);
        setResponsePopUp(true);
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setResponsePopUp(true);
      });
  };

  return (
    <View style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <View style={styles.inputWrapper}>
        <Input
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          errorStyle={{ color: "red" }}
          style={{ paddingLeft: 0 }}
          responseMessage={email.length === 0 ? "Enter your email!" : null}
        />
      </View>
      <Button
        title="Send Email"
        disabled={email ? false : true}
        onPress={onReset}
      />
      <ResponseModal
        isVisible={responsePopUp}
        setIsVisible={setResponsePopUp}
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
  inputWrapper: {
    width: "70%",
  },
});
