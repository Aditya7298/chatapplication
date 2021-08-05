import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

import { useMutation } from "../../hooks/useMutation";

import { fetchRequestBuilder } from "../../utils/fetchRequestBuilder";

import { MessageInfo } from "../../../types/Message.interface";

import sendicon from "../../../assets/images/right-arrow.png";

import "./MessageInput.css";

type MessageInputProps = {
  userId: string;
  onNewMessageCreation: (newMessageId: string) => void;
};

export const MessageInput = ({
  userId,
  onNewMessageCreation,
}: MessageInputProps) => {
  const [newMessageText, setNewMessageText] = useState("");
  const [requestSent, setRequestSent] = useState(true);

  const { mutate, data, error } = useMutation<MessageInfo>((data) => {
    const { url, options } = fetchRequestBuilder({
      path: "/messages",
      payload: data,
      method: "POST",
    });

    return fetch(url, options);
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessageInfo = {
      text: newMessageText,
      messageId: nanoid(),
      senderId: userId,
      timestamp: new Date(),
    };

    mutate(newMessageInfo);
    setRequestSent(false);
  };

  useEffect(() => {
    if (data && !requestSent) {
      setRequestSent(true);
      setNewMessageText("");
      onNewMessageCreation(data.messageId);
    }

    if (error) {
      //Handle Error
    }
  }, [data, error, onNewMessageCreation, requestSent]);

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
          placeholder="Type a message..."
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
