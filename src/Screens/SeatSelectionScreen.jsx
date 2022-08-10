import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Dialog } from "react-native-elements";

export const SeatSelectionScreen = ({
  route,
  bus,
  user,
  isVisible,
  setIsVisible,
}) => {
  const [allSeats, setAllSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const { journeyClass, busType } = user;

  useEffect(() => {
    let { availableTickets } = bus;
    setAllSeats(availableTickets);
    setSelectedSeat([]);
    setError("");
  }, [isVisible, bus, journeyClass]);

  const selectSeat = (seat) => {
    setError("");
    let selected = [...selectedSeat];
    if (selected.length === 4 && allSeats[seat] === "false") {
      setError("Can not book more than 4 at once!");
    } else {
      if (seat in allSeats) {
        let data1 = { ...allSeats };
        if (allSeats[seat] === "true") {
          data1[seat] = "false";
          selected = selected.filter((one) => one !== seat);
        } else {
          data1[seat] = "true";
          selected.push(seat);
        }
        setAllSeats(data1);
      }
    }
    setSelectedSeat(selected);
  };

  const onSubmit = () => {
    setIsVisible(false);
    navigation.navigate("passengers", { user, bus, selectedSeat });
  };

  return (
    <View>
      <Dialog style={styles.modalWrapper} isVisible={isVisible}>
        <Dialog.Title title="Select Seat(s):" />
        <View style={styles.inst}>
          <View style={styles.inst1}>
            <View style={styles.sleep} />
            <Text>Available</Text>
          </View>
          <View style={styles.inst1}>
            <View style={[styles.sleep, { backgroundColor: "green" }]} />
            <Text>Selected</Text>
          </View>
          <View style={styles.inst1}>
            <View style={[styles.sleep, { backgroundColor: "red" }]} />
            <Text>Booked</Text>
          </View>
        </View>
        <Text style={{ color: "red", marginTop: "5%" }}>{error}</Text>
        <ScrollView style={styles.scrollWrapeer}>
          <View style={styles.seats}>
            {journeyClass === "Sleeper" ? (
              <>
                <View>
                  {allSeats
                    ? Object.keys(allSeats).map((one, i) => {
                        return i <= 9 ? (
                          <View
                            key={one}
                            style={{
                              alignItems: "center",
                              flexDirection: "row",
                              marginBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.sleep1,
                                allSeats[one] === "true"
                                  ? { backgroundColor: "green", color: "white" }
                                  : allSeats[one] === "booked"
                                  ? {
                                      backgroundColor: "red",
                                      color: "white",
                                    }
                                  : null,
                              ]}
                              onPress={
                                allSeats[one] !== "booked"
                                  ? () => selectSeat(one)
                                  : null
                              }
                            >
                              <Text>{one}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : null;
                      })
                    : null}
                </View>
                <View>
                  {allSeats
                    ? Object.keys(allSeats).map((one, i) => {
                        return i <= 9 ? (
                          <View
                            key={Object.keys(allSeats)[10 + i]}
                            style={{
                              alignItems: "center",
                              flexDirection: "row",
                              marginBottom: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.sleep1,
                                allSeats[Object.keys(allSeats)[10 + i]] ===
                                "true"
                                  ? { backgroundColor: "green", color: "white" }
                                  : allSeats[Object.keys(allSeats)[10 + i]] ===
                                    "booked"
                                  ? {
                                      backgroundColor: "red",
                                      color: "white",
                                    }
                                  : null,
                              ]}
                              onPress={
                                allSeats[Object.keys(allSeats)[10 + i]] !==
                                "booked"
                                  ? () =>
                                      selectSeat(Object.keys(allSeats)[10 + i])
                                  : null
                              }
                            >
                              <Text>{Object.keys(allSeats)[10 + i]}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : null;
                      })
                    : null}
                </View>
              </>
            ) : (
              <>
                <View style={styles.seater}>
                  <View>
                    {allSeats
                      ? Object.keys(allSeats).map((one, i) => {
                          return i <= 9 ? (
                            <View
                              key={one}
                              style={{
                                alignItems: "center",
                                flexDirection: "row",
                                marginBottom: 10,
                              }}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.seater1,
                                  allSeats[one] === "true"
                                    ? {
                                        backgroundColor: "green",
                                        color: "white",
                                      }
                                    : allSeats[one] === "booked"
                                    ? {
                                        backgroundColor: "red",
                                        color: "white",
                                      }
                                    : null,
                                ]}
                                onPress={
                                  allSeats[one] !== "booked"
                                    ? () => selectSeat(one)
                                    : null
                                }
                              >
                                <Text>{one}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null;
                        })
                      : null}
                  </View>
                  <View>
                    {allSeats
                      ? Object.keys(allSeats).map((one, i) => {
                          return i > 9 && i <= 19 ? (
                            <View
                              key={one}
                              style={{
                                alignItems: "center",
                                flexDirection: "row",
                                marginBottom: 10,
                              }}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.seater1,
                                  allSeats[one] === "true"
                                    ? {
                                        backgroundColor: "green",
                                        color: "white",
                                      }
                                    : allSeats[one] === "booked"
                                    ? {
                                        backgroundColor: "red",
                                        color: "white",
                                      }
                                    : null,
                                ]}
                                onPress={
                                  allSeats[one] !== "booked"
                                    ? () => selectSeat(one)
                                    : null
                                }
                              >
                                <Text>{one}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null;
                        })
                      : null}
                  </View>
                </View>
                <View style={styles.seater}>
                  <View>
                    {allSeats
                      ? Object.keys(allSeats).map((one, i) => {
                          return i <= 9 ? (
                            <View
                              key={one}
                              style={{
                                alignItems: "center",
                                flexDirection: "row",
                                marginBottom: 10,
                              }}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.seater1,
                                  allSeats[Object.keys(allSeats)[20 + i]] ===
                                  "true"
                                    ? {
                                        backgroundColor: "green",
                                        color: "white",
                                      }
                                    : allSeats[
                                        Object.keys(allSeats)[20 + i]
                                      ] === "booked"
                                    ? {
                                        backgroundColor: "red",
                                        color: "white",
                                      }
                                    : null,
                                ]}
                                onPress={
                                  allSeats[Object.keys(allSeats)[20 + i]] !==
                                  "booked"
                                    ? () =>
                                        selectSeat(
                                          Object.keys(allSeats)[20 + i]
                                        )
                                    : null
                                }
                              >
                                <Text>{Object.keys(allSeats)[20 + i]}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null;
                        })
                      : null}
                  </View>
                  <View>
                    {allSeats
                      ? Object.keys(allSeats).map((one, i) => {
                          return i > 9 && i <= 19 ? (
                            <View
                              key={one}
                              style={{
                                alignItems: "center",
                                flexDirection: "row",
                                marginBottom: 10,
                              }}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.seater1,
                                  allSeats[Object.keys(allSeats)[20 + i]] ===
                                  "true"
                                    ? {
                                        backgroundColor: "green",
                                        color: "white",
                                      }
                                    : allSeats[
                                        Object.keys(allSeats)[20 + i]
                                      ] === "booked"
                                    ? {
                                        backgroundColor: "red",
                                        color: "white",
                                      }
                                    : null,
                                ]}
                                onPress={
                                  allSeats[Object.keys(allSeats)[20 + i]] !==
                                  "booked"
                                    ? () =>
                                        selectSeat(
                                          Object.keys(allSeats)[20 + i]
                                        )
                                    : null
                                }
                              >
                                <Text>{Object.keys(allSeats)[20 + i]}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : null;
                        })
                      : null}
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <Dialog.Actions>
          <Dialog.Button title="Confirm" onPress={onSubmit} />
          <Dialog.Button title="Cancel" onPress={() => setIsVisible(false)} />
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    width: "12%",
  },
  inst: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  inst1: {
    justifyContent: "space-between",
  },
  sleep: {
    borderWidth: 0.5,
    height: 65,
    width: 35,
    marginLeft: 10,
  },
  sleep1: {
    borderWidth: 0.5,
    height: 35,
    width: 65,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  seater1: {
    borderWidth: 0.5,
    height: 35,
    width: 45,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollWrapeer: {
    height: "60%",
    marginTop: "10%",
    marginBottom: 0,
  },
  seats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seater: {
    display: "flex",
    flexDirection: "row",
  },
});
