import { useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";
import sendicon from "../../assets/images/right-arrow.png";
import exiticon from "../../assets/images/exit.png";
import { Message } from "../message/Message";
import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
};

export const ChatArea = ({ chatRoomId }: ChatAreaProps) => {
  const { data: chatRoomData, isLoading } = useQuery<ChatRoomInfo>({
    url: `http://localhost:8080/chatrooms/${chatRoomId}`,
    method: "GET",
  });
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewMessage(value);
  };

  return (
    <div className="chatarea">
      {!isLoading && chatRoomData && (
        <>
          <div className="chatarea-header">
            <span className="chatarea-header-title">
              {chatRoomData.chatRoomName}
            </span>
            <img
              className="chatarea-header-exit"
              alt="close current chat"
              src={exiticon}
              height="40px"
              width="40px"
            />
          </div>
          <div className="chatarea-messages">
            {chatRoomData.messageIds.map((messageId) => (
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
