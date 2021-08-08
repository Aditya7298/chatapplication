import React, { useState } from "react";

import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import "./AddUserForm.css";

type AddUserFormProps = {
  chatRoomId: string;
  chatRoomName: string;
  onNewUserAddition: (newUserName: string) => void;
};

export const AddUserForm = ({
  chatRoomId,
  chatRoomName,
  onNewUserAddition,
}: AddUserFormProps) => {
  const [userName, setUserName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { mutate } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}`,
      payload: {
        key: "userNames",
        value: [...data],
      },
    });
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate([userName], {
      onSuccess: () => {
        onNewUserAddition(userName);
      },

      onError: (message: string) => {
        setErrorMessage(message);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
  };

  return (
    <div className="adduser">
      <form onSubmit={handleSubmit} className="adduser-form">
        <h2>Add a new user to {chatRoomName}</h2>
        <label>
          Username
          <input
            type="text"
            name="name"
            value={userName}
            onChange={handleChange}
            placeholder="Enter username"
            className="adduser-form-field"
          />
        </label>
        <button type="submit" className="adduser-form-button">
          Add User
        </button>
      </form>
      <div className="error">{errorMessage}</div>
    </div>
  );
};
