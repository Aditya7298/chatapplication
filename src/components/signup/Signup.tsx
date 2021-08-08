import { useState } from "react";
import { nanoid } from "nanoid";

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
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username
          <input
            name="userName"
            value={userFormDetails.userName}
            onChange={handleChange}
            required
            placeholder="Enter New Username"
            className={`signup-form-field ${
              signupError &&
              signupError.match(/user/i) &&
              "signup-form-field-error"
            }`}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={userFormDetails.password}
            required
            placeholder="Enter New Password"
            onChange={handleChange}
            className="signup-form-field"
          />
        </label>
        <button
          className="signup-form-button"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Please wait..." : "Submit"}
        </button>
        {status === "idle" || status === "rejected" ? (
          <button
            className="signup-form-toggle"
            type="button"
            onClick={onShowLoginFormClick}
          >
            Log In
          </button>
        ) : null}
      </form>
      <div className="signup-error">{signupError}</div>
    </div>
  );
};
