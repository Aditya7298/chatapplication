import { useState } from "react";
import { Login } from "../login/Login";
import { Main } from "../main/Main";
import "./ChatApp.css";

export const ChatApp = () => {
  const [userId, setUserId] = useState("");

  const handleLogin = (loggedUserId: string) => {
    setUserId(loggedUserId);
  };

  return (
    <div className="chatapp">
      {userId === "" && <Login onLogin={handleLogin} />}
      {userId !== "" && <Main userId={userId} />}
    </div>
  );
};
