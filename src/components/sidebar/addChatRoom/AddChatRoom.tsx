import React, { useState } from "react";
import { nanoid } from "nanoid";

import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import { CHAT_ROOM_TYPE } from "../../../constants";

import "./AddChatRoom.css";

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
      type: CHAT_ROOM_TYPE.PERSONAL,
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
    <div className="addchatroom">
      <form onSubmit={handleSubmit} className="addchatroom-form">
        <label>
          Chatroom Name
          <input
            type="text"
            name="name"
            value={chatRoomFormDetails.name}
            onChange={handleChange}
            className="addchatroom-form-field"
          />
        </label>
        <label>
          Personal Chat
          <input
            type="checkbox"
            name="type"
            value={CHAT_ROOM_TYPE.PERSONAL}
            checked={chatRoomFormDetails.type === CHAT_ROOM_TYPE.PERSONAL}
            onChange={handleChange}
            className="addchatroom-form-field"
          />
        </label>
        <label>
          Group Chat
          <input
            type="checkbox"
            name="type"
            value={CHAT_ROOM_TYPE.GROUP}
            checked={chatRoomFormDetails.type === CHAT_ROOM_TYPE.GROUP}
            onChange={handleChange}
            className="addchatroom-form-field"
          />
          {chatRoomFormDetails.type === CHAT_ROOM_TYPE.PERSONAL ? (
            <label>
              Enter Participant Username
              <input
                type="text"
                name="participantName"
                value={chatRoomFormDetails.participantName}
                onChange={handleChange}
                className="addchatroom-form-field"
              />
            </label>
          ) : null}
        </label>
        <button type="submit" className=".addchatroom-form-button">
          Create Chatroom
        </button>
      </form>
    </div>
  );
};
