import { useState, useEffect } from "react";

import { useQuery } from "../../hooks/useQuery";

import { MessageInfo } from "../../../types/Message.interface";
import { UserInfo } from "../../../types/User.interface";

import "./Message.css";

type MessageProps = {
  messageId: string;
  prevMessageId: string;
};

export const Message = ({ messageId, prevMessageId }: MessageProps) => {
  const { data: messageData } = useQuery<MessageInfo>({
    path: `/messages/${messageId}`,
  });

  const [skipPrevMessageQuery, setskipPrevMessageQuery] = useState(true);

  const { data: prevMessageData } = useQuery<MessageInfo>({
    path: `/messages/${prevMessageId}`,
    skip: skipPrevMessageQuery,
  });

  useEffect(() => {
    if (prevMessageId) {
      setskipPrevMessageQuery(false);
    }
  }, [prevMessageId]);

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

  const getMessageDateAndTime = (timestamp: Date, format: "date" | "time") => {
    const time = new Date(timestamp);

    if (format === "date") {
      return time.toDateString();
    }

    return `${time.getHours()}:${
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
    }`;
  };

  return (
    <div className="message">
      {senderData && messageData ? (
        <>
          <div className="message-info-date">
            {prevMessageData === undefined ||
            getMessageDateAndTime(messageData.timestamp, "date") !==
              getMessageDateAndTime(prevMessageData.timestamp, "date") ? (
              <div className="message-info-date_text">
                {getMessageDateAndTime(messageData.timestamp, "date")}
              </div>
            ) : null}
          </div>
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
            <div className="message-info">
              <span className="message-info-sendername">
                {senderData.userName}
              </span>
              <span className="message-info-time">
                {" "}
                {getMessageDateAndTime(messageData.timestamp, "time")}
              </span>
            </div>
            <div className="message-text">{messageData.text}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};
