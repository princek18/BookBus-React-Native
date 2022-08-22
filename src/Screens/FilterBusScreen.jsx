import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Loader } from "../Loader/Loader";
import { logout, requestAPI, ResponseModal } from "../Utils/Utils";
import { Card, Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LoginContext } from "../Context/LoginContextProvider";

export const FilterBusScreen = ({ navigation, drawerNavigation }) => {
  const [loader, setLoader] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [resData, setResData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState({
    origin: false,
    destination: false,
    busType: false,
    journeyDate: false,
    journeyClass: false,
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [userForm, setUserForm] = useState({
    origin: "",
    destination: "",
    busType: "",
    journeyDate: moment().format("yyyy-MM-DD") || "Select date...",
    journeyClass: "",
  });
  const { state } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = state;
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseModal, setIsResponseModal] = useState(false);

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
        if (err.response.data.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });

    setLoader(true);
    requestAPI("GET", "/getdropdwonvalues", null, null)
      .then((res) => {
        setLoader(false);
        let responseData = res.data;
        setResData(responseData);
      })
      .catch((err) => {
        setLoader(false);
        setResponseMessage(err?.response?.data?.message);
        setIsResponseModal(true);
        if (err.response.data.message === "Authentication Failed.") {
          logout();
          setIsLoggedIn(false);
          navigation.navigate("Login");
        }
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{ color: "white", paddingRight: 10, fontSize: 18 }}>
          Balance: ₹{wallet}
        </Text>
      ),
    });
  }, [wallet]);

  const handleSubmit = () => {
    for (const err in error) {
      error[err] = false;
    }
    setValidationMessage("");
    if (userForm.origin === null || userForm.origin === "") {
      setValidationMessage("Please select origin!");
      setError({
        ...error,
        origin: true,
      });
    } else if (userForm.destination === null || userForm.destination === "") {
      setValidationMessage("Please select destination!");
      setError({
        ...error,
        destination: true,
      });
    } else if (userForm.origin === userForm.destination) {
      setValidationMessage("Origin and Destination can't be same!");
      setError({
        ...error,
        origin: true,
        destination: true,
      });
    } else if (userForm.busType === null || userForm.busType === "") {
      setValidationMessage("Please select Bus Type!");
      setError({
        ...error,
        busType: true,
      });
    } else if (userForm.journeyClass === null || userForm.journeyClass === "") {
      setValidationMessage("Please select journey Class!");
      setError({
        ...error,
        journeyClass: true,
      });
    } else if (
      userForm.journeyDate === null ||
      userForm.journeyDate === "" ||
      userForm.journeyDate === "Select date..."
    ) {
      setValidationMessage("Please select journey Date!");
      setError({
        ...error,
        journeyDate: true,
      });
    } else {
      setLoader(true);
      requestAPI("POST", "/searchbuses", userForm, null)
        .then((res) => {
          setLoader(false);
          navigation.navigate("BusList", { data: res.data });
        })
        .catch((err) => {
          setLoader(false);
          setResponseMessage(err?.response?.data?.message);
          setIsResponseModal(true);
          if (err.response.data.message === "Authentication Failed.") {
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
      <View style={styles.cardWrapper}>
        <Card title="Search for buses!">
          <Text style={{ color: "red" }}>{validationMessage}</Text>
          <Text>Origin:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userForm.origin}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== "") {
                  setUserForm({ ...userForm, origin: itemValue });
                }
              }}
            >
              <Picker.Item label="Select origin ..." value="" />
              {resData?.location &&
                resData.location.map((one) => (
                  <Picker.Item
                    key={one.value}
                    label={one.label}
                    value={one.value}
                  />
                ))}
            </Picker>
          </View>
          <View style={styles.iconView}>
            <Ionicons
              onPress={() => {
                setUserForm({
                  ...userForm,
                  origin: userForm.destination,
                  destination: userForm.origin,
                });
              }}
              name="swap-vertical-outline"
              size={24}
              color="black"
            />
          </View>
          <Text>Destination:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userForm.destination}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== "") {
                  setUserForm({ ...userForm, destination: itemValue });
                }
              }}
            >
              <Picker.Item label="Select destination ..." value="" />
              {resData?.location &&
                resData.location.map((one) => (
                  <Picker.Item
                    key={one.value}
                    label={one.label}
                    value={one.value}
                  />
                ))}
            </Picker>
          </View>
          <View style={styles.halfPicker}>
            <View style={styles.insidePicker}>
              <Picker
                selectedValue={userForm.busType}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "") {
                    setUserForm({ ...userForm, busType: itemValue });
                  }
                }}
              >
                <Picker.Item label="Select bus ..." value="" />
                {resData?.busType &&
                  resData.busType.map((one) => (
                    <Picker.Item
                      key={one.value}
                      label={one.label}
                      value={one.value}
                    />
                  ))}
              </Picker>
            </View>
            <View style={styles.insidePicker}>
              <Picker
                selectedValue={userForm.journeyClass}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue !== "") {
                    setUserForm({ ...userForm, journeyClass: itemValue });
                  }
                }}
              >
                <Picker.Item label="Select class ..." value="" />
                {resData?.journeyClass &&
                  resData.journeyClass.map((one) => (
                    <Picker.Item
                      key={one.value}
                      label={one.label}
                      value={one.value}
                    />
                  ))}
              </Picker>
            </View>
          </View>
          <View style={[styles.insidePicker, styles.datePicker]}>
            <Text onPress={() => setShowDatePicker(true)}>
              {userForm.journeyDate}
            </Text>
          </View>
          <DateTimePickerModal
            onConfirm={(date) => {
              setUserForm({
                ...userForm,
                journeyDate: moment(date).format("yyyy-MM-DD"),
              });
              setShowDatePicker(false);
            }}
            mode="date"
            minimumDate={new Date()}
            onCancel={() => setShowDatePicker(false)}
            isVisible={showDatePicker}
            display="default"
          />
          <Button title="Submit" onPress={handleSubmit} />
        </Card>
      </View>
      <ResponseModal
        message={responseMessage}
        isVisible={isResponseModal}
        setIsVisible={setIsResponseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: "100%",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
  },
  picker: {
    height: 35,
    width: "100%",
  },
  insidePicker: {
    width: "45%",
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
  },
  iconView: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  halfPicker: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  datePicker: {
    paddingLeft: 10,
    height: 38,
  },
});
