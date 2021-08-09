import { useState } from "react";
import { nanoid } from "nanoid";

import { Form } from "../form/Form";
import { Input } from "../form/Input";
import { Button } from "../form/Button";

import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import "./Signup.css";

type SignupProps = {
  onSignup: (userId: string) => void;
  onShowLoginFormClick: () => void;
};

export const Signup = ({ onSignup, onShowLoginFormClick }: SignupProps) => {
  const [userFormDetails, setUserFormDetails] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFormDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const { status, mutate } = useMutation((data) => {
    return ajaxClient.post({ path: "/users", payload: data });
  });

  const [signupError, setSignupError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserData = {
      ...userFormDetails,
      userId: nanoid(),
      avatar: "",
      personalChats: [],
      groupChats: [],
    };

    mutate(newUserData, {
      onSuccess: (data: { userId: string }) => {
        onSignup(data.userId);
      },

      onError: (message: string) => {
        setSignupError(message);
      },
    });
  };

  return (
    <div className="signup">
      <h2>Create a new account</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          name="userName"
          type="text"
          value={userFormDetails.userName}
          onChange={handleChange}
          required={true}
          placeholder="Enter New Username"
          error={signupError?.match(/user/i) !== undefined}
        />
        <Input
          name="password"
          type="password"
          value={userFormDetails.password}
          required={true}
          placeholder="Enter New Password"
          onChange={handleChange}
          label="Password"
        />
        <Button isDisabled={status === "loading"}>
          {status === "loading" ? "Please wait..." : "Submit"}
        </Button>
        {status === "idle" || status === "rejected" ? (
          <Button type="button" onClick={onShowLoginFormClick}>
            Log In
          </Button>
        ) : null}
      </Form>
      <div className="error">{signupError}</div>
    </div>
  );
};
