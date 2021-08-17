import { useState } from "react";
import { nanoid } from "nanoid";

import { useMutation } from "../../hooks/useMutation";

import { useUserContext } from "../../contexts/UserContext";

import { ajaxClient } from "../../utils/ajaxClient";

import { MessageInfo } from "../../../types/Message.interface";
import { SentMessageType } from "../../../types/SentMessage.type";

import sendicon from "../../../assets/images/paper-plane.svg";

import "./MessageInput.css";

type MessageInputProps = {
  chatRoomId: string;
  onNewMessageCreation: (newMessageData: SentMessageType) => void;
  onNewMessageCreationFaliure: (failedMessageId: string) => void;
};

export const MessageInput = ({
  chatRoomId,
  onNewMessageCreation,
  onNewMessageCreationFaliure,
}: MessageInputProps) => {
  const { userId } = useUserContext();

  const [newMessageText, setNewMessageText] = useState("");

  const { mutate } = useMutation((data) => {
    return ajaxClient.post({ path: "/messages", payload: data });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessageData = {
      text: newMessageText,
      senderId: userId,
      timestamp: new Date(),
    };

    const payload = { ...newMessageData, chatRoomId };

    setNewMessageText("");

    const tempMessageId = nanoid();
    onNewMessageCreation({
      ...newMessageData,
      messageId: tempMessageId,
      prevId: undefined,
    });

    mutate(payload, {
      onSuccess: (data: MessageInfo) => {
        onNewMessageCreation({
          ...data,
          prevId: tempMessageId,
        });
      },

      onError: () => {
        onNewMessageCreationFaliure(tempMessageId);
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
          required
        />
        <button className="chatarea-input-send">
          <img alt="send message" src={sendicon} />
        </button>
      </form>
    </div>
  );
};
