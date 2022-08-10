import { Image, View } from "react-native";

export const ViewImageScreen = () => {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 0.1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "center",
          width: "90%",
          top: 50,
        }}
      >
        <View
          style={{ backgroundColor: "#fc5c65", height: 40, width: 40 }}
        ></View>
        <View
          style={{ backgroundColor: "#4ECDC4", height: 40, width: 40 }}
        ></View>
      </View>
      <Image
        style={{
          alignSelf: "center",
          resizeMode: "contain",
          width: "100%",
          height: "100%",
        }}
        source={require("../assets/chair.jpg")}
      />
    </View>
  );
};
