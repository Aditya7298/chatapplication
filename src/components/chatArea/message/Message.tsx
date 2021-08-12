import { MessageLoader } from "../../loaders/messageLoader/MessageLoader";

import { useQuery } from "../../hooks/useQuery";

import { useUserContext } from "../../contexts/UserContext";

import { MessageInfo } from "../../../types/Message.interface";
import { UserInfo } from "../../../types/User.interface";

import "./Message.css";

type MessageProps = {
  ind: number;
  messageData: MessageInfo;
  nextMessageDate: Date | undefined;
};

const TIME_STAMP_FORMAT = {
  DATE: "DATE",
  TIME: "TIME",
} as const;

export const Message = ({
  messageData,
  nextMessageDate,
  ind,
}: MessageProps) => {
  const userData = useUserContext();

  const { data } = useQuery<UserInfo>({
    path: `/users/${messageData.senderId}`,
    skip: messageData.senderId === userData.userId,
  });

  const senderData = messageData.senderId === userData.userId ? userData : data;

  const getMessageDateAndTime = (
    timestamp: Date,
    format: typeof TIME_STAMP_FORMAT.DATE | typeof TIME_STAMP_FORMAT.TIME
  ) => {
    const time = new Date(timestamp);

    return format === TIME_STAMP_FORMAT.DATE
      ? time.toDateString()
      : `${time.getHours()}:${
          time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
        }`;
  };

  const showMessageDate =
    !nextMessageDate ||
    getMessageDateAndTime(nextMessageDate, TIME_STAMP_FORMAT.DATE) !==
      getMessageDateAndTime(messageData.timestamp, TIME_STAMP_FORMAT.DATE);

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
                )}
              </span>
            </div>
            <div className="message-text">{messageData.text}</div>
          </div>
        </div>
      ) : (
        <MessageLoader />
      )}
      {messageData && showMessageDate ? (
        <div style={{ zIndex: 1000 - ind }} className="message-info-date">
          <div className="message-info-date_text">
            {getMessageDateAndTime(
              messageData.timestamp,
              TIME_STAMP_FORMAT.DATE
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
