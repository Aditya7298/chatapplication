import React, { useState, useCallback } from "react";
import { nanoid } from "nanoid";

import { Form } from "../../form/Form";
import { Button } from "../../form/Button";
import { UserDropdown } from "../../form/UserDropdown";

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

  const handleUserNameChange = useCallback((newUserName: string) => {
    setUserName(newUserName);
  }, []);

  return (
    <>
      <h2>Start a new personal chat</h2>
      <Form onSubmit={handleSubmit}>
        <UserDropdown onChange={handleUserNameChange} value={userName} />
        <Button>Add personal chat</Button>
      </Form>
      <div className="error">{errorMessage}</div>
    </>
  );
};
