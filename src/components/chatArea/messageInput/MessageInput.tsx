import { useQuery } from "../../hooks/useQuery";
import { useState, useEffect } from "react";
import { MessageInfo } from "../../../ts/types/Message.interface";
import sendicon from "../../../assets/images/right-arrow.png";
import { nanoid } from "nanoid";
import "./MessageInput.css";

type MessageInputProps = {
  userId: string;
  onNewMessageCreation: (newMessageId: string) => void;
};

type NewMessageQuery = {
  skip: boolean;
  payload: MessageInfo | undefined;
};

export const MessageInput = ({
  userId,
  onNewMessageCreation,
}: MessageInputProps) => {
  const [newMessageText, setNewMessageText] = useState("");

  const [newMessageQuery, setNewMessageQuery] = useState<NewMessageQuery>({
    skip: true,
    payload: undefined,
  });

  const { data, isLoading } = useQuery<MessageInfo>({
    url: "/messages",
    method: "POST",
    payload: newMessageQuery.payload,
    skip: newMessageQuery.skip,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessageInfo: MessageInfo = {
      text: newMessageText,
      messageId: nanoid(),
      senderId: userId,
      timestamp: new Date(),
    };

    setNewMessageQuery({
      skip: false,
      payload: newMessageInfo,
    });
  };

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setNewMessageText("");
        onNewMessageCreation(data.messageId);
      } else {
        //Handle Error Here !!
      }
    }
  }, [isLoading, data, onNewMessageCreation, newMessageQuery]);

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
