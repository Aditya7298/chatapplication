import React, { useState } from "react";

import { Form } from "../../form/Form";
import { Input } from "../../form/Input";
import { Button } from "../../form/Button";

import { AUTHENTICATION_MODE } from "../../../constants";

import "./AuthenticationForm.css";

type AuthenticationFormProps = {
  formTitle: string;
  onSubmit: (userName: string, password: string) => void;
  onToggleClick: () => void;
  toggleMessage: string;
  errorMessage: string | undefined;
  isLoading: boolean;
  authMode:
    | typeof AUTHENTICATION_MODE.LOGIN
    | typeof AUTHENTICATION_MODE.SIGNUP;
};

export const AuthenticationForm = ({
  formTitle,
  onSubmit,
  onToggleClick,
  errorMessage,
  isLoading,
  toggleMessage,
}: AuthenticationFormProps) => {
  const [formDetails, setFormDetails] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formDetails.userName, formDetails.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <div className="authentication-form">
        <h2>{formTitle}</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            label="username"
            name="userName"
            type="text"
            value={formDetails.userName}
            onChange={handleChange}
            required={true}
            placeholder="Enter username"
            error={
              errorMessage !== undefined && errorMessage.match(/user/i) !== null
            }
          />
          <Input
            label="password"
            name="password"
            type="password"
            value={formDetails.password}
            required={true}
            placeholder="Enter Password"
            onChange={handleChange}
            error={
              errorMessage !== undefined &&
              errorMessage?.match(/password/i) !== null
            }
          />
          <Button isDisabled={isLoading}>
            {isLoading ? "Please wait..." : "Submit"}
          </Button>
          {isLoading ? null : (
            <Button type="button" onClick={onToggleClick}>
              {toggleMessage}
            </Button>
          )}
        </Form>
        <div className="error">{errorMessage}</div>
      </div>
    </>
  );
};
