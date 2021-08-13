import React, { useState } from "react";
import { nanoid } from "nanoid";

import { Form } from "../../form/Form";
import { Input } from "../../form/Input";
import { Button } from "../../form/Button";

import { useMutation } from "../../hooks/useMutation";

import { useUserContext } from "../../contexts/UserContext";

import { ajaxClient } from "../../utils/ajaxClient";

import { CHAT_ROOM_TYPE } from "../../../constants";

type ChatRoomFormDetails = {
  name: string;
  type: typeof CHAT_ROOM_TYPE.GROUP | typeof CHAT_ROOM_TYPE.PERSONAL;
};

type AddChatRoomProps = {
  onNewChatRoomCreation: (chatRoomId: string) => void;
};

export const AddChatRoom = ({ onNewChatRoomCreation }: AddChatRoomProps) => {
  const { userName } = useUserContext();

  const [chatRoomFormDetails, setChatRoomFormDetails] =
    useState<ChatRoomFormDetails>({
      name: "",
      type: CHAT_ROOM_TYPE.GROUP,
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newChatRoomData = {
      chatRoomId: nanoid(),
      chatRoomName: chatRoomFormDetails.name,
      type: chatRoomFormDetails.type,
      participantNames: [userName],
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
          required={true}
          onChange={handleChange}
        />
        <Button>Create Chatroom</Button>
      </Form>
    </>
  );
};
