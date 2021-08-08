import { useCallback } from "react";

import { Message } from "../message/Message";
import { MessageInput } from "./messageInput/MessageInput";

import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";

import exiticon from "../../assets/images/exit.png";

import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
};

export const ChatArea = ({ chatRoomId }: ChatAreaProps) => {
  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
    interval: 1000,
  });

  const { mutate } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}`,
      payload: data,
    });
  });

  const handleNewMessageCreation = useCallback(
    (newMessageId: string) => {
      if (!chatRoomData) {
        return;
      }

      const updatedMessageIds = [...chatRoomData.messageIds, newMessageId];

      mutate({
        key: "messageIds",
        value: updatedMessageIds,
      });
    },

    [chatRoomData, mutate]
  );

  return (
    <div className="chatarea">
      {chatRoomData ? (
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
          <MessageInput onNewMessageCreation={handleNewMessageCreation} />
        </>
      ) : null}
    </div>
  );
};
