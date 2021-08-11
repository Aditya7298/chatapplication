import { useQuery } from "../../hooks/useQuery";

import { MessageInfo } from "../../../types/Message.interface";
import { UserInfo } from "../../../types/User.interface";

import "./Message.css";

type MessageProps = {
  messageData: MessageInfo;
};

const TIME_STAMP_FORMAT = {
  DATE: "DATE",
  TIME: "TIME",
} as const;

export const Message = ({ messageData }: MessageProps) => {
  const { data: senderData } = useQuery<UserInfo>({
    path: `/users/${messageData.senderId}`,
  });

  const getMessageDateAndTime = (
    timestamp: Date,
    format: typeof TIME_STAMP_FORMAT.DATE | typeof TIME_STAMP_FORMAT.TIME
  ) => {
    const time = new Date(timestamp);

    return format === TIME_STAMP_FORMAT.DATE
      ? time.toDateString().slice(4)
      : `${time.getHours()}:${
          time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
        }`;
  };

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
                {getMessageDateAndTime(
                  messageData.timestamp,
                  TIME_STAMP_FORMAT.TIME
                )}{" "}
                {getMessageDateAndTime(
                  messageData.timestamp,
                  TIME_STAMP_FORMAT.DATE
                )}
              </span>
            </div>
            <div className="message-text">{messageData.text}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};
