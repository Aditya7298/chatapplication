import { useState, useCallback } from "react";
import { Login } from "../login/Login";
import { Signup } from "../../signup/Signup";
import { Main } from "../main/Main";
import "./ChatApp.css";

export const ChatApp = () => {
  const [userId, setUserId] = useState<string | undefined>();
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleSignupAndLogin = useCallback((userId: string) => {
    console.log(userId);
    setUserId(userId);
  }, []);

  const handleShowSignupFormClick = useCallback(
    () => setShowLoginForm(false),
    []
  );
  const handleShowLoginFormClick = useCallback(
    () => setShowLoginForm(true),
    []
  );

  return (
    <div className="chatapp">
      {!userId ? (
        showLoginForm ? (
          <Login
            onLogin={handleSignupAndLogin}
            onShowSignupFormClick={handleShowSignupFormClick}
          />
        ) : (
          <Signup
            onSignup={handleSignupAndLogin}
            onShowLoginFormClick={handleShowLoginFormClick}
          />
        )
      ) : (
        <Main userId={userId} />
      )}
    </div>
  );
};
