import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";
import sendicon from "../../assets/images/right-arrow.png";
import exiticon from "../../assets/images/exit.png";
import { Message } from "../message/Message";
import "./ChatArea.css";

interface ChatAreaProps {
  chatRoomId: string;
}

export const ChatArea = ({ chatRoomId }: ChatAreaProps) => {
  const { data: chatRoomData, isLoading } = useFetch<ChatRoomInfo>(
    `chatroom/${chatRoomId}`
  );
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewMessage(value);
  };

  const { chatRoomName, messageIds } = chatRoomData;

  return (
    <div className="chatarea">
      {!isLoading && (
        <>
          <div className="chatarea-header">
            <span className="chatarea-header-title">{chatRoomName}</span>
            <img
              className="chatarea-header-exit"
              alt="close current chat"
              src={exiticon}
              height="40px"
              width="40px"
            />
          </div>
          <div className="chatarea-messages">
            {messageIds.map((messageId) => (
              <Message key={messageId} messageId={messageId} />
            ))}
          </div>
          <div className="chatarea-input">
            <input
              className="chatarea-input-text"
              type="text"
              placeholder="Type a message..."
              name="newmessage"
              value={newMessage}
              onChange={handleChange}
            />
            <span className="chatarea-input-send">
              <img alt="send message" src={sendicon} />
            </span>
          </div>
        </>
      )}
    </div>
  );
};
