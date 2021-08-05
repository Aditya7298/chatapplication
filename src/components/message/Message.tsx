import { useState, useEffect } from "react";

import { useQuery } from "../hooks/useQuery";

import { MessageInfo } from "../../types/Message.interface";
import { UserInfo } from "../../types/User.interface";

import "./Message.css";

type MessageProps = {
  messageId: string;
};

export const Message = ({ messageId }: MessageProps) => {
  const { data: messageData, isLoading } = useQuery<MessageInfo>({
    url: `/messages/${messageId}`,
    method: "GET",
  });

  const [skipUserQuery, setSkipUserQuery] = useState(true);

  const { data: senderData, isLoading: isSenderDataLoading } =
    useQuery<UserInfo>({
      url: `/users/${messageData?.senderId}`,
      method: "GET",
      skip: skipUserQuery,
    });

  useEffect(() => {
    if (messageData) {
      setSkipUserQuery(false);
    }
  }, [messageData]);

  return (
    <div className="message">
      <div className="message-left-info">
        {!isSenderDataLoading && (
          <img
            className="message-sender-avatar"
            src={senderData?.avatar}
            alt="user avatar"
            height="50px"
            width="50px"
          />
        )}
      </div>
      <div className="message-right-info">
        {!isSenderDataLoading && (
          <div className="message-sender-info">{senderData?.userName}</div>
        )}
        {!isLoading && <div className="message-text">{messageData?.text}</div>}
      </div>
    </div>
  );
};
