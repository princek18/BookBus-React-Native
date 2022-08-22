import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { requestAPI, ResponseModal } from "../Utils/Utils";
import { Loader } from "../Loader/Loader";

export default function RegisterScreen({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseModal, setIsResponseModal] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });

  useEffect(() => {
    if (
      userForm.firstName === "" ||
      userForm.lastName === "" ||
      userForm.email === "" ||
      userForm.mobile.length != 10 ||
      userForm.password === "" ||
      userForm.cpassword === ""
    ) {
      setIsVerified(false);
    } else {
      setIsVerified(true);
    }
  }, [userForm]);

  const handleRegister = () => {
    setLoader(true);
    requestAPI("POST", "/signup", userForm, null)
      .then((res) => {
        setLoader(false);
        if (res.status === 200) {
          setResponseMessage(res.data.message);
          setIsResponseModal(true);
          setTimeout(() => {
            delete userForm.cpassword;
            navigation.navigate("Login");
          }, 2000);
        }
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setIsResponseModal(true);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <Text style={styles.header}>User Registration</Text>
      <View style={styles.formWrapper}>
        <Input
          type="text"
          placeholder="First Name"
          autoFocus
          value={userForm.firstName}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.firstName.length === 0 ? "Enter your first name!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, firstName: text })}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={userForm.lastName}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.lastName.length === 0 ? "Enter your last name!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, lastName: text })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={userForm.email}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.email.length === 0 ? "Enter your email!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, email: text })}
        />
        <Input
          type="number"
          placeholder="Mobile"
          value={userForm.mobile}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.mobile.length !== 10
              ? "Mobile no should be of 10 digits!"
              : null
          }
          onChangeText={(text) =>
            setUserForm({ ...userForm, mobile: text.replace(/[^0-9]/g, "") })
          }
        />
        <Input
          type="password"
          placeholder="Password"
          secureTextEntry
          value={userForm.password}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.password.length === 0 ? "Enter your password!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, password: text })}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          secureTextEntry
          value={userForm.cpassword}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.cpassword !== userForm.password
              ? "Password didn't match!"
              : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, cpassword: text })}
        />
      </View>
      <Button
        buttonStyle={styles.button}
        title="Register"
        disabled={!isVerified}
        onPress={handleRegister}
      />
      <ResponseModal
        message={responseMessage}
        isVisible={isResponseModal}
        setIsVisible={setIsResponseModal}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    padding: 10,
  },
  formWrapper: {
    width: "70%",
  },
  button: {
    width: 200,
  },
});
