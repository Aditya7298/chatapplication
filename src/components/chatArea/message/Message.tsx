import { useState, useEffect } from "react";

import { useQuery } from "../../hooks/useQuery";

import { MessageInfo } from "../../../types/Message.interface";
import { UserInfo } from "../../../types/User.interface";

import "./Message.css";

type MessageProps = {
  messageData: MessageInfo;
  nextMessageDate: Date | undefined;
};

export const Message = ({ messageData, nextMessageDate }: MessageProps) => {
  const [showMessageDate, setShowMessageDate] = useState(false);

  const { data: senderData } = useQuery<UserInfo>({
    path: `/users/${messageData?.senderId}`,
  });

  const getMessageDateAndTime = (timestamp: Date, format: "date" | "time") => {
    const time = new Date(timestamp);

    if (format === "date") {
      return time.toDateString();
    }

    return `${time.getHours()}:${
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
    }`;
  };

  useEffect(() => {
    setShowMessageDate(
      nextMessageDate === undefined ||
        getMessageDateAndTime(nextMessageDate, "date") !==
          getMessageDateAndTime(messageData.timestamp, "date")
    );
  }, [messageData.timestamp, nextMessageDate]);

  return (
    <>
      {senderData && messageData ? (
        <div className="message">
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
        </div>
      ) : null}
      {messageData && showMessageDate ? (
        <div className="message-info-date">
          <div className="message-info-date_text">
            {getMessageDateAndTime(messageData.timestamp, "date")}
          </div>
        </div>
      ) : null}
    </>
  );
};
