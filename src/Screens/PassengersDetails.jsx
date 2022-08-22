import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

export default function PassengersDetails({ route, navigation }) {
  const { user, bus, selectedSeat } = route.params;
  const [error, setError] = useState({
    name: false,
    age: false,
    gender: false,
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [passenger1, setPassenger1] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [passenger2, setPassenger2] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [passenger3, setPassenger3] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [passenger4, setPassenger4] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const passengersList = [passenger1, passenger2, passenger3, passenger4];

  const handleSubmit = (e) => {
    let PassengersDetails = [];
    for (let i = 0; i < selectedSeat.length; i++) {
      PassengersDetails.push(passengersList[i]);
    }
    let error = false;
    for (let i = 0; i < PassengersDetails.length; i++) {
      if (
        PassengersDetails[i].name === "" ||
        PassengersDetails[i].age === "" ||
        PassengersDetails[i].gender === ""
      ) {
        error = true;
        break;
      }
    }
    if (error) {
      setValidationMessage("All fields are Mandatory!");
    } else {
      navigation.navigate("review", {
        user,
        bus,
        selectedSeat,
        Passengers: PassengersDetails,
      });
    }
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.wrapper2}>
        <Text style={{ color: "red" }}>{validationMessage}</Text>
        <ScrollView>
          {selectedSeat.map((one, i) => {
            return (
              <View style={styles.cardWrapper} key={one}>
                <Card>
                  <Text>Name:</Text>
                  <Input
                    value={passengersList[i].name}
                    onChangeText={(text) =>
                      i === 0
                        ? setPassenger1((pre) => ({ ...pre, name: text }))
                        : i === 1
                        ? setPassenger2((pre) => ({ ...pre, name: text }))
                        : i === 2
                        ? setPassenger3((pre) => ({ ...pre, name: text }))
                        : setPassenger4((pre) => ({ ...pre, name: text }))
                    }
                    placeholder="name.."
                    style={{ padding: 0 }}
                  />
                  <Text>Age:</Text>
                  <Input
                    value={passengersList[i].age}
                    onChangeText={(text) =>
                      i === 0
                        ? setPassenger1((pre) => ({ ...pre, age: text }))
                        : i === 1
                        ? setPassenger2((pre) => ({ ...pre, age: text }))
                        : i === 2
                        ? setPassenger3((pre) => ({ ...pre, age: text }))
                        : setPassenger4((pre) => ({ ...pre, age: text }))
                    }
                    placeholder="age.."
                    style={{ padding: 0 }}
                  />
                  <Text>Gender:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={passengersList[i].gender}
                      style={styles.picker}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemValue !== "") {
                          i === 0
                            ? setPassenger1((pre) => ({
                                ...pre,
                                gender: itemValue,
                              }))
                            : i === 1
                            ? setPassenger2((pre) => ({
                                ...pre,
                                gender: itemValue,
                              }))
                            : i === 2
                            ? setPassenger3((pre) => ({
                                ...pre,
                                gender: itemValue,
                              }))
                            : setPassenger4((pre) => ({
                                ...pre,
                                gender: itemValue,
                              }));
                        }
                      }}
                    >
                      <Picker.Item label="Select gender ..." value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                  </View>
                </Card>
              </View>
            );
          })}
        </ScrollView>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper2: {
    width: "100%",
    flex: 1,
  },
  cardWrapper: {
    paddingBottom: 10,
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
