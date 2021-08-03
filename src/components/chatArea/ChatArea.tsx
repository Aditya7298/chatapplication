import { useState, useEffect, useCallback } from "react";
import { useQuery } from "../hooks/useQuery";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";
import exiticon from "../../assets/images/exit.png";
import { Message } from "../message/Message";
import { MessageInput } from "./messageInput/MessageInput";
import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
  userId: string;
};

type ChatRoomUpdateQuery = {
  skip: boolean;
  payload: { key: string; value: any } | undefined;
};

export const ChatArea = ({ chatRoomId, userId }: ChatAreaProps) => {
  const { data: queriedChatRoomData, isLoading: isChatRoomDataQueried } =
    useQuery<ChatRoomInfo>({
      url: `/chatrooms/${chatRoomId}`,
      method: "GET",
    });

  const [chatRoomData, setChatRoomData] = useState<ChatRoomInfo | undefined>();

  useEffect(() => {
    setChatRoomData(queriedChatRoomData);
  }, [queriedChatRoomData]);

  const [chatRoomUpdateQuery, setChatRoomUpdateQuery] =
    useState<ChatRoomUpdateQuery>({
      skip: true,
      payload: undefined,
    });

  const { data: updatedChatRoomData } = useQuery<ChatRoomInfo>({
    url: `/chatrooms/${chatRoomId}`,
    method: "PATCH",
    skip: chatRoomUpdateQuery.skip,
    payload: chatRoomUpdateQuery.payload,
  });

  useEffect(() => {
    return () => {
      setChatRoomUpdateQuery({
        skip: true,
        payload: undefined,
      });
    };
  }, [chatRoomId]);

  const handleNewMessageCreation = useCallback(
    (newMessageId: string) => {
      if (chatRoomData && !chatRoomData.messageIds.includes(newMessageId)) {
        setChatRoomUpdateQuery({
          skip: false,
          payload: {
            key: "messageIds",
            value: [...chatRoomData.messageIds, newMessageId],
          },
        });
      }
    },
    [chatRoomData]
  );

  useEffect(() => {
    if (updatedChatRoomData) {
      setChatRoomData(updatedChatRoomData);
    }
  }, [updatedChatRoomData]);

  return (
    <div className="chatarea">
      {!isChatRoomDataQueried && chatRoomData && (
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
