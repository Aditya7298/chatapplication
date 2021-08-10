import { useState } from "react";

import { Form } from "../form/Form";
import { Input } from "../form/Input";
import { Button } from "../form/Button";

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
      <Form onSubmit={handleSubmit}>
        <Input
          label="username"
          error={loginError?.match(/user/i) !== undefined}
          placeholder="Enter Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          label="password"
          error={loginError?.match(/password/i) !== undefined}
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button isDisabled={status === "loading"}>
          {status === "loading" ? "Please wait..." : "Login"}
        </Button>
        {status === "idle" || status === "rejected" ? (
          <Button type="button" onClick={onShowSignupFormClick}>
            Create Account
          </Button>
        ) : null}
      </Form>
      <div className="error">{loginError}</div>
    </div>
  );
};
