import { useState, useCallback } from "react";
import { nanoid } from "nanoid";

import { AuthenticationForm } from "./authenticationForm/AuthenticationForm";

import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import { AUTHENTICATION_MODE } from "../../constants";

import "./UnauthenticatedApp.css";

type UnauthenticatedAppProps = {
  onAuthentication: (userId: string) => void;
};

export const UnauthenticatedApp = ({
  onAuthentication,
}: UnauthenticatedAppProps) => {
  const [authMode, setAuthMode] = useState<
    typeof AUTHENTICATION_MODE.SIGNUP | typeof AUTHENTICATION_MODE.LOGIN
  >(AUTHENTICATION_MODE.LOGIN);

  const { status, mutate, error } = useMutation(
    useCallback(
      (data) =>
        ajaxClient.post({
          path: `${
            authMode === AUTHENTICATION_MODE.SIGNUP ? "/users" : "/login"
          }`,
          payload: data,
        }),
      [authMode]
    )
  );

  const handleSubmit = useCallback(
    (userName: string, password: string) => {
      const payload =
        authMode === AUTHENTICATION_MODE.SIGNUP
          ? {
              userName,
              password,
              userId: nanoid(),
              avatar: "",
              personalChats: [],
              groupChats: [],
            }
          : { userName, password };

      mutate(payload, {
        onSuccess: (data: { userId: string }) => onAuthentication(data.userId),
      });
    },
    [mutate, onAuthentication, authMode]
  );

  const toggleAuthMode = () => {
    setAuthMode((prevState) =>
      prevState === AUTHENTICATION_MODE.LOGIN
        ? AUTHENTICATION_MODE.SIGNUP
        : AUTHENTICATION_MODE.LOGIN
    );
  };

  return (
    <div className="unauthenticated-app">
      <AuthenticationForm
        authMode={authMode}
        onSubmit={handleSubmit}
        onToggleClick={toggleAuthMode}
        toggleMessage={
          authMode === AUTHENTICATION_MODE.LOGIN ? "Sign Up" : "Log In"
        }
        formTitle={
          authMode === AUTHENTICATION_MODE.SIGNUP
            ? "Create a new account"
            : "Enter your login details"
        }
        errorMessage={error}
        isLoading={status === "loading"}
        showPasswordFormat={authMode === "SIGNUP"}
      />
    </div>
  );
};
