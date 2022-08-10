import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import {
  logout,
  PasswordCheckDialogBox,
  requestAPI,
  ResponseModal,
} from "../Utils/Utils";
import { Loader } from "../Loader/Loader";
import { LoginContext } from "../Context/LoginContextProvider";

export default function ProfileScreen({ navigation }) {
  const [loader, setLoader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResponseModal, setIsResponseModal] = useState(false);
  const [isPasswordCheckModal, setIsPasswordCheckModal] = useState(false);
  const [password, setPassword] = useState("");
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;
  const [responseMessage, setResponseMessage] = useState("");
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    npassword: "",
  });

  useEffect(() => {
    if (
      userForm.firstName === "" ||
      userForm.lastName === "" ||
      userForm.email === "" ||
      userForm.mobile?.length != 10
    ) {
      setIsVerified(false);
    } else {
      setIsVerified(true);
    }
  }, [userForm]);

  useEffect(() => {
    setLoader(true);
    requestAPI("GET", "/getprofile", null, null)
      .then((res) => {
        setLoader(false);
        let response = res.data.user;
        setUserForm((prev) => ({
          ...prev,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          mobile: response.mobile,
        }));
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

  const handleUpdate = () => {
    setLoader(true);
    setIsPasswordCheckModal(false);
    let data = { ...userForm };
    data["password"] = password;
    requestAPI("PUT", "/updateprofile", data, null)
      .then((res) => {
        setLoader(false);
        let response = res.data.user;
        setResponseMessage(res.data.message);
        setIsResponseModal(true);
        if (userForm.npassword !== null && userForm.npassword !== "") {
          setTimeout(() => {
            logout();
            setIsLoggedIn(false);
            navigation.navigate("Login");
          }, 2000);
        }
        setUserForm({
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          mobile: response.mobile,
          npassword: "",
        });
        setPassword("");
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setIsResponseModal(true);
        setUserForm((prev) => ({ ...prev, npassword: "" }));
        setPassword("");
        if (err?.response?.data?.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper}>
      {loader ? <Loader /> : null}
      <Text style={styles.header}>Update Profile</Text>
      <View style={styles.formWrapper}>
        <Input
          type="text"
          placeholder="First Name"
          autoFocus
          value={userForm.firstName}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.firstName?.length === 0 ? "Enter your first name!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, firstName: text })}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={userForm.lastName}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.lastName?.length === 0 ? "Enter your last name!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, lastName: text })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={userForm.email}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.email?.length === 0 ? "Enter your email!" : null
          }
          onChangeText={(text) => setUserForm({ ...userForm, email: text })}
        />
        <Input
          type="number"
          placeholder="Mobile"
          value={userForm.mobile}
          errorStyle={{ color: "red" }}
          errorMessage={
            userForm.mobile?.length !== 10
              ? "Mobile no should be of 10 digits!"
              : null
          }
          onChangeText={(text) =>
            setUserForm({ ...userForm, mobile: text.replace(/[^0-9]/g, "") })
          }
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={userForm.npassword}
          onChangeText={(text) => setUserForm({ ...userForm, npassword: text })}
        />
      </View>
      <Button
        buttonStyle={styles.button}
        title="Update"
        disabled={!isVerified}
        onPress={() => setIsPasswordCheckModal(true)}
      />
      <PasswordCheckDialogBox
        isVisible={isPasswordCheckModal}
        setIsVisible={setIsPasswordCheckModal}
        password={password}
        setPassword={setPassword}
        handleConfirm={handleUpdate}
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
