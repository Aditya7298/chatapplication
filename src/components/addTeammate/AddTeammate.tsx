import React, { useState } from "react";
import { nanoid } from "nanoid";

import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import { CHAT_ROOM_TYPE } from "../../constants";

import "./AddTeammate.css";

type AddTeammateProps = {
  currUserName: string;
  onNewTeammateAddition: () => void;
};

export const AddTeammate = ({
  currUserName,
  onNewTeammateAddition,
}: AddTeammateProps) => {
  const [userName, setUserName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { mutate } = useMutation((data) => {
    return ajaxClient.post({
      path: `/chatrooms`,
      payload: {
        chatRoomId: nanoid(),
        chatRoomName: "personal chat room",
        participantNames: [userName, currUserName],
        messageIds: [],
        type: CHAT_ROOM_TYPE.PERSONAL,
      },
    });
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate([userName], {
      onSuccess: () => {
        onNewTeammateAddition();
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
    <div className="addteammate">
      <form onSubmit={handleSubmit} className="addteammate-form">
        <h2>Start a new personal chat</h2>
        <label>
          Username
          <input
            type="text"
            name="name"
            value={userName}
            onChange={handleChange}
            placeholder="Enter username"
            className="addteammate-form-field"
          />
        </label>
        <button type="submit" className="addteammate-form-button">
          Add personal chat
        </button>
      </form>
      <div className="error">{errorMessage}</div>
    </div>
  );
};
