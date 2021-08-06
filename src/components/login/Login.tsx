import { useState } from "react";

import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import "./Login.css";

type LoginProps = {
  onLogin: (userId: string) => void;
  onShowSignupFormClick: () => void;
};

export const Login = ({ onLogin, onShowSignupFormClick }: LoginProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState<string | undefined>();

  const { mutate, status } = useMutation((data) => {
    return ajaxClient.post({ path: "/login", payload: data });
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: (data: { userId: string }) => {
        onLogin(data.userId);
      },

      onError: (message: string) => {
        setLoginError(message);
      },
    });
  };

  return (
    <div className="login">
      <h2>Enter your login details</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            className={`login-form-field ${
              loginError &&
              loginError.match(/user/i) &&
              "login-form-field-error"
            }`}
            placeholder="Enter Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            className={`login-form-field ${
              loginError &&
              loginError.match(/password/i) &&
              "login-form-field-error"
            }`}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button className="login-form-button" disabled={status === "loading"}>
          {status === "loading" ? "Please wait..." : "Login"}
        </button>
        {status === "idle" ? (
          <button
            className="signup-form-toggle"
            type="button"
            onClick={onShowSignupFormClick}
          >
            Create Account
          </button>
        ) : null}
      </form>
      <div className="login-error">{loginError}</div>
    </div>
  );
};
