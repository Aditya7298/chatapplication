import { useState } from "react";
import axios from "axios";
import "./Login.css";

interface LoginProps {
  onLogin: (userId: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    axios
      .post("/login", {
        username,
        password,
      })
      .then((res) => {
        onLogin(res.data.userId);
      })
      .catch((err) => {
        if (err.response) {
          setIsLoading(false);
          setErrorMessage(err.response.data.message);
        }
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
              errorMessage.match(/user/i) && "login-form-field-error"
            }`}
            placeholder="Enter Username"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            className={`login-form-field ${
              errorMessage.match(/password/i) && "login-form-field-error"
            }`}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleChange}
          />
        </label>
        <button className="login-form-button" disabled={isLoading}>
          {isLoading ? "Please wait..." : "Login"}
        </button>
      </form>
      <div className="login-error">{errorMessage}</div>
    </div>
  );
};
