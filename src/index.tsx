import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ChatApp } from "./components/chatApp/ChatApp";

// if (process.env.NODE_ENV === "development") {
// const { worker } = require("./mocks/server/browser");
// worker.start();
// }

ReactDOM.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>,
  document.getElementById("root")
);
