import { Image, ImageBackground, Text, View } from "react-native";

export const WelcomeScreen = () => {
  return (
    <ImageBackground
      style={{ flex: 1, justifyContent: "flex-end" }}
      source={require("../assets/background.jpg")}
    >
      <View style={{ top: 60, alignSelf: "center", position: "absolute" }}>
        <Image
          style={{ height: 80, width: 80, alignSelf: "center" }}
          source={require("../assets/logo-red.png")}
        />
        <Text>Sell What You Don't Need</Text>
      </View>
      <View
        style={{
          backgroundColor: "#fc5c65",
          width: "100%",
          height: 70,
        }}
      ></View>
      <View
        style={{
          backgroundColor: "#4ECDC4",
          width: "100%",
          height: 70,
        }}
      ></View>
    </ImageBackground>
  );
};
