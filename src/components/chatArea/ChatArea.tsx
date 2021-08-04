import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";
import { useSubscription } from "../hooks/useSubscription";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";
import exiticon from "../../assets/images/exit.png";
import { Message } from "../message/Message";
import { MessageInput } from "./messageInput/MessageInput";
import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
  userId: string;
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

  const updateMessageIds = useCallback((newChatRoomData: ChatRoomInfo) => {
    setChatRoomData((prevState) => {
      if (prevState) {
        return { ...prevState, messageIds: newChatRoomData.messageIds };
      } else {
        return prevState;
      }
    });
  }, []);

  useSubscription<ChatRoomInfo>({
    subscriptionCallback: updateMessageIds,
    url: `/chatrooms/${chatRoomId}`,
  });

  const {
    mutate,
    isLoading: isChatRoomUpdated,
    error: chatRoomUpdationError,
  } = useMutation((data) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const url = `${process.env.REACT_APP_BASE_URL}/chatrooms/${chatRoomId}`;

    return fetch(url, options);
  });

  const newMessageIdRef = useRef<string>();

  const handleNewMessageCreation = useCallback(
    (newMessageId: string) => {
      newMessageIdRef.current = newMessageId;
      if (chatRoomData) {
        const updatedMessageIds = [...chatRoomData.messageIds, newMessageId];

        setChatRoomData((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              messageIds: [...prevState.messageIds, newMessageId],
            };
          } else {
            return prevState;
          }
        });

        mutate({
          key: "messageIds",
          value: updatedMessageIds,
        });
      }
    },
    [chatRoomData, mutate]
  );

  useEffect(() => {
    if (!isChatRoomUpdated) {
      if (chatRoomUpdationError) {
        setChatRoomData((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              messageIds: prevState.messageIds.filter(
                (messageId) => messageId !== newMessageIdRef.current
              ),
            };
          } else {
            return prevState;
          }
        });

        //Show Error Screen
      }
    }
  }, [isChatRoomUpdated, chatRoomUpdationError]);

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
