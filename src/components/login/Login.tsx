import { useState, useEffect } from "react";
import "./Login.css";
import { useQuery } from "../hooks/useQuery";

type LoginProps = {
  onLogin: (userId: string) => void;
};

export const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [queryData, setQueryData] = useState({
    skip: true,
    payload: {},
  });

  const { data, error, isLoading } = useQuery<{ userId: string }>({
    url: "/login",
    method: "POST",
    payload: queryData.payload,
    skip: queryData.skip,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    setQueryData({
      payload: { username, password },
      skip: false,
    });
  };

  useEffect(() => {
    if (data?.userId) {
      onLogin(data.userId);
    }
  }, [data?.userId, onLogin]);

  return (
    <div className="login">
      <h2>Enter your login details</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            className={`login-form-field ${
              error && error.match(/user/i) && "login-form-field-error"
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
              error && error.match(/password/i) && "login-form-field-error"
            }`}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button className="login-form-button" disabled={isLoading}>
          {isLoading ? "Please wait..." : "Login"}
        </button>
      </form>
      <div className="login-error">{error}</div>
    </div>
  );
};
