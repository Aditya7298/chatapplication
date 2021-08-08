import { useState, useEffect } from "react";

import { useQuery } from "../hooks/useQuery";

import { MessageInfo } from "../../types/Message.interface";
import { UserInfo } from "../../types/User.interface";

import "./Message.css";

type MessageProps = {
  messageId: string;
};

export const Message = ({ messageId }: MessageProps) => {
  const { data: messageData } = useQuery<MessageInfo>({
    path: `/messages/${messageId}`,
  });

  const [skipUserQuery, setSkipUserQuery] = useState(true);

  const { data: senderData } = useQuery<UserInfo>({
    path: `/users/${messageData?.senderId}`,
    skip: skipUserQuery,
  });

  useEffect(() => {
    if (messageData) {
      setSkipUserQuery(false);
    }
  }, [messageData]);

  const formatTimestamp = (timestamp: Date) => {
    const time = new Date(timestamp);
    return `${time.getHours()}:${time.getMinutes()}`;
  };

  return (
    <div className="message">
      {senderData && messageData ? (
        <>
          <div className="message-left-info">
            <img
              className="message-sender-avatar"
              src={senderData.avatar}
              alt="user avatar"
              height="50px"
              width="50px"
            />
          </div>

          <div className="message-right-info">
            <div>
              <span className="message-sender-info-name">
                {senderData.userName}
              </span>
              <span className="message-time">
                {" "}
                {formatTimestamp(messageData.timestamp)}
              </span>
            </div>
            <div className="message-text">{messageData.text}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};
