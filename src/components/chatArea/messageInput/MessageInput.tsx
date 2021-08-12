import { useState, useContext } from "react";
import { nanoid } from "nanoid";

import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import { MessageInfo } from "../../../types/Message.interface";

import sendicon from "../../../assets/images/paper-plane.svg";

import "./MessageInput.css";

type MessageInputProps = {
  onNewMessageCreation: (newMessageData: MessageInfo) => void;
};

export const MessageInput = ({ onNewMessageCreation }: MessageInputProps) => {
  const { userId } = useContext(UserContext);

  const [newMessageText, setNewMessageText] = useState("");

  const { mutate } = useMutation((data) => {
    return ajaxClient.post({ path: "/messages", payload: data });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessageDate = {
      text: newMessageText,
      messageId: nanoid(),
      senderId: userId,
      timestamp: new Date(),
    };

    setNewMessageText("");
    onNewMessageCreation(newMessageDate);

    mutate(newMessageDate, {
      onSuccess: () => {},
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewMessageText(value);
  };

  return (
    <div className="chatarea-input">
      <form className="chatarea-input-form" onSubmit={handleSubmit}>
        <input
          className="chatarea-input-text"
          type="text"
          placeholder="Type a new message..."
          name="newmessage"
          value={newMessageText}
          onChange={handleChange}
          required
        />
        <button className="chatarea-input-send">
          <img alt="send message" src={sendicon} />
        </button>
      </form>
    </div>
  );
};
