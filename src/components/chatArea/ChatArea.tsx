import { useState, useEffect, useCallback } from "react";

import { Message } from "../message/Message";
import { MessageInput } from "./messageInput/MessageInput";

import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";
import { useSubscription } from "../hooks/useSubscription";

import { fetchRequestBuilder } from "../utils/fetchRequestBuilder";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";

import exiticon from "../../assets/images/exit.png";

import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
  userId: string;
};

export const ChatArea = ({ chatRoomId, userId }: ChatAreaProps) => {
  const { data: queriedChatRoomData } = useQuery<ChatRoomInfo>({
    url: `/chatrooms/${chatRoomId}`,
    method: "GET",
  });

  const [chatRoomData, setChatRoomData] = useState<ChatRoomInfo | undefined>();

  useEffect(() => {
    setChatRoomData(queriedChatRoomData);
  }, [queriedChatRoomData]);

  const updateMessageIds = useCallback((newMessageIds: string[]) => {
    setChatRoomData((prevState) => {
      if (!prevState) {
        return prevState;
      }

      return { ...prevState, messageIds: newMessageIds };
    });
  }, []);

  useSubscription<ChatRoomInfo>({
    subscriptionCallback: useCallback(
      (updatedChatRoomData: ChatRoomInfo) =>
        updateMessageIds(updatedChatRoomData.messageIds),
      [updateMessageIds]
    ),
    url: `/chatrooms/${chatRoomId}`,
  });

  const { mutate } = useMutation((data) => {
    const { url, options } = fetchRequestBuilder({
      path: `/chatrooms/${chatRoomId}`,
      payload: data,
      method: "PATCH",
    });

    return fetch(url, options);
  });

  const handleNewMessageCreation = useCallback(
    (newMessageId: string) => {
      if (!chatRoomData) {
        return;
      }

      const updatedMessageIds = [...chatRoomData.messageIds, newMessageId];

      updateMessageIds(updatedMessageIds);

      mutate(
        {
          key: "messageIds",
          value: updatedMessageIds,
        },
        {
          onError: () => {
            updateMessageIds(
              chatRoomData.messageIds.filter(
                (messageId) => messageId !== newMessageId
              )
            );
          },
        }
      );
    },

    [chatRoomData, mutate, updateMessageIds]
  );

  return (
    <div className="chatarea">
      {chatRoomData && (
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
          <MessageInput
            userId={userId}
            onNewMessageCreation={handleNewMessageCreation}
          />
        </>
      )}
    </div>
  );
};
