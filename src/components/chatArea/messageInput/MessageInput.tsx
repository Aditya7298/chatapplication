import { useState, useContext } from "react";
import { nanoid } from "nanoid";

import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "../../hooks/useMutation";

import { ajaxClient } from "../../utils/ajaxClient";

import sendicon from "../../../assets/images/paper-plane.svg";

import "./MessageInput.css";

type MessageInputProps = {
  onNewMessageCreation: (newMessageId: string) => void;
};

export const MessageInput = ({ onNewMessageCreation }: MessageInputProps) => {
  const { userId } = useContext(UserContext);

  const [newMessageText, setNewMessageText] = useState("");

  const { mutate } = useMutation((data) => {
    return ajaxClient.post({ path: "/messages", payload: data });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessageInfo = {
      text: newMessageText,
      messageId: nanoid(),
      senderId: userId,
      timestamp: new Date(),
    };

    mutate(newMessageInfo, {
      onSuccess: (data: { messageId: string }) => {
        setNewMessageText("");
        onNewMessageCreation(data.messageId);
      },
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
        />
        <button className="chatarea-input-send">
          <img alt="send message" src={sendicon} />
        </button>
      </form>
    </div>
  );
};
