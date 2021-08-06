import { useState, useCallback } from "react";

import { Login } from "../login/Login";
import { Signup } from "../signup/Signup";

type UnauthenticatedAppProps = {
  onAuthentication: (userId: string) => void;
};

export const UnauthenticatedApp = ({
  onAuthentication,
}: UnauthenticatedAppProps) => {
  const [authForm, setAuthForm] = useState<"login" | "signup">("login");

  const handleLoginAndSignup = useCallback(
    (userId: string) => {
      onAuthentication(userId);
    },
    [onAuthentication]
  );

  const handleShowSignupFormClick = useCallback(
    () => setAuthForm("signup"),
    []
  );

  const handleShowLoginFormClick = useCallback(() => setAuthForm("login"), []);

  return authForm === "login" ? (
    <Login
      onLogin={handleLoginAndSignup}
      onShowSignupFormClick={handleShowSignupFormClick}
    />
  ) : (
    <Signup
      onSignup={handleLoginAndSignup}
      onShowLoginFormClick={handleShowLoginFormClick}
    />
  );
};
