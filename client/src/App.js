import "./App.css";

import { context } from "./Context";
import { io } from "socket.io-client";
import OnetoOneChat from "./Components/OnetoOneChat";
// import { NotificationContainer } from "react-notifications";

function App() {
  const socket = io.connect("http://localhost:3001");

  return (
    <context.Provider value={{ socket }}>
      <OnetoOneChat />
      {/* <div style={{ position: "relative" }}>
        {" "}
        <NotificationContainer />
      </div> */}
    </context.Provider>
  );
}

export default App;
