import React, { useState } from "react";
import { nanoid } from "nanoid";

import { Form } from "../../form/Form";
import { Input } from "../../form/Input";
import { Button } from "../../form/Button";

import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import { CHAT_ROOM_TYPE } from "../../../constants";

type ChatRoomFormDetails = {
  name: string;
  type: typeof CHAT_ROOM_TYPE.GROUP | typeof CHAT_ROOM_TYPE.PERSONAL;
  participantName: string;
};

type AddChatRoomProps = {
  onNewChatRoomCreation: (chatRoomId: string) => void;
  userName: string;
};

export const AddChatRoom = ({
  userName,
  onNewChatRoomCreation,
}: AddChatRoomProps) => {
  const [chatRoomFormDetails, setChatRoomFormDetails] =
    useState<ChatRoomFormDetails>({
      name: "",
      type: CHAT_ROOM_TYPE.GROUP,
      participantName: "",
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const participantNames = [userName];

    if (chatRoomFormDetails.participantName !== "") {
      participantNames.push(chatRoomFormDetails.participantName);
    }

    const newChatRoomData = {
      chatRoomId: nanoid(),
      chatRoomName: chatRoomFormDetails.name,
      type: chatRoomFormDetails.type,
      participantNames,
      messageIds: [],
    };

    mutate(newChatRoomData, {
      onSuccess: (data: { chatRoomId: string }) => {
        onNewChatRoomCreation(data.chatRoomId);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChatRoomFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { mutate } = useMutation((data) =>
    ajaxClient.post({ path: "/chatrooms", payload: data })
  );

  return (
    <>
      <h2>Create a new group</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          label="Group Name"
          type="text"
          name="name"
          value={chatRoomFormDetails.name}
          placeholder="Enter group name"
          onChange={handleChange}
        />
        <Button>Create Chatroom</Button>
      </Form>
    </>
  );
};
