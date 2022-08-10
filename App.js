import { LoginContextProvider } from "./src/Context/LoginContextProvider";
import Navigator from "./src/Navigator";

export const baseUrl = "https://book-bus-pk18.herokuapp.com";
export default function App() {
  return (
    <LoginContextProvider>
      <Navigator />
    </LoginContextProvider>
  );
}
