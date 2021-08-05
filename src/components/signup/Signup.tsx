import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

import { useMutation } from "../hooks/useMutation";

import { fetchRequestBuilder } from "../utils/fetchRequestBuilder";

import { UserInfo } from "../../types/User.interface";

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

  const { mutate, isLoading, data, error } = useMutation<UserInfo>((data) => {
    const { url, options } = fetchRequestBuilder({
      path: "/users",
      method: "POST",
      payload: data,
    });

    return fetch(url, options);
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserData = {
      ...userFormDetails,
      userId: nanoid(),
      avatar: "",
      personalChats: [],
      groupChats: [],
    };

    mutate(newUserData);
  };

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        onSignup(data.userId);
      }
    }
  }, [isLoading, data, onSignup]);

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
              error && error.match(/user/i) && "signup-form-field-error"
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
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Submit"}
        </button>
        {!isLoading && (
          <button
            className="signup-form-toggle"
            type="button"
            disabled={isLoading}
            onClick={onShowLoginFormClick}
          >
            Log In
          </button>
        )}
      </form>
      <div className="signup-error">{error}</div>
    </div>
  );
};
