import React, { useState } from "react";
import { nanoid } from "nanoid";

import { Form } from "../../form/Form";
import { Input } from "../../form/Input";
import { Button } from "../../form/Button";

import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import { CHAT_ROOM_TYPE } from "../../../constants";

type AddTeammateProps = {
  currUserName: string;
  onNewTeammateAddition: () => void;
};

export const AddTeammate = ({
  currUserName,
  onNewTeammateAddition,
}: AddTeammateProps) => {
  const [userName, setUserName] = useState<string>("");

  const { mutate, error: errorMessage } = useMutation((data) => {
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
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserName(value);
  };

  return (
    <>
      <h2>Start a new personal chat</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="name"
          value={userName}
          onChange={handleChange}
          placeholder="Enter username"
        />
        <Button>Add personal chat</Button>
      </Form>
      <div className="error">{errorMessage}</div>
    </>
  );
};
