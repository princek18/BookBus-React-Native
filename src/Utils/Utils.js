import axios from "axios";
import { baseUrl } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dialog, Input } from "react-native-elements";
import { Text } from "react-native";

export const requestAPI = async (method, url, data, params) => {
  const AuthToken = await AsyncStorage.getItem("authToken");

  const promise = await axios({
    method: method,
    url: `${baseUrl}${url}`,
    params: params,
    data: data,
    headers: {
      authToken: AuthToken,
    },
  });

  return promise;
};

export const logout = () => {
  AsyncStorage.removeItem("authToken");
  AsyncStorage.removeItem("name");
  AsyncStorage.removeItem("usertype");
  console.log("Logged Out");
};

export const ResponseModal = ({
  message,
  isVisible,
  setIsVisible,
  isError = false,
}) => {
  return (
    <Dialog isVisible={isVisible}>
      <Text>{message}</Text>
      <Dialog.Actions>
        <Dialog.Button title="Ok" onPress={() => setIsVisible(false)} />
      </Dialog.Actions>
    </Dialog>
  );
};

export const PasswordCheckDialogBox = ({
  isVisible,
  setIsVisible,
  password,
  setPassword,
  handleConfirm,
}) => {
  const handleCancel = () => {
    setPassword("");
    setIsVisible(false);
  };
  return (
    <Dialog isVisible={isVisible}>
      <Text>Confirm Password:</Text>
      <Input
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholder="Password.."
        errorStyle={{ color: "red" }}
        errorMessage={password.length === 0 ? "Confirm your password!" : null}
        style={{ padding: 0 }}
      />
      <Dialog.Actions>
        <Dialog.Button title="Cancel" onPress={handleCancel} />
        <Dialog.Button
          disabled={password.length > 2 ? false : true}
          title="Confirm"
          onPress={handleConfirm}
        />
      </Dialog.Actions>
    </Dialog>
  );
};
