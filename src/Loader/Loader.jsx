import React from "react";
import { Audio } from "react-loader-spinner";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export const Loader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 20000,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
