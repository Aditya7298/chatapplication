import { useState, useEffect } from "react";

import { Message } from "../message/Message";
import { MessageLoader } from "../../loaders/messageLoader/MessageLoader";

import { useQuery } from "../../hooks/useQuery";

import { getUniqueMessages } from "./utils/getUniqueMessages";

import { MessageInfo } from "../../../types/Message.interface";

type ChatAreaMessagesProps = {
  chatRoomId: string;
  newMessageData?: MessageInfo;
};

export const ChatAreaMessages = ({
  chatRoomId,
  newMessageData,
}: ChatAreaMessagesProps) => {
  const [chatRoomMessages, setChatRoomMessages] = useState<MessageInfo[]>([]);

  const [lastMessageId, setLastMessageId] = useState<string>();

  const { data: paginatedMessagesData, status: paginatedMessagesDataStatus } =
    useQuery<MessageInfo[]>({
      path: lastMessageId
        ? `/chatrooms/${chatRoomId}/messages/${lastMessageId}`
        : `/chatrooms/${chatRoomId}/messages/`,
    });

  const { data: newMessagesData } = useQuery<MessageInfo[]>({
    path: `/chatrooms/${chatRoomId}/newMessages/${chatRoomMessages[0]?.messageId}`,
    queryInterval: 1000,
    // skip: chatRoomMessages.length === 0,
  });

  useEffect(() => {
    if (!newMessagesData) {
      return;
    }

    setChatRoomMessages((prevState) =>
      getUniqueMessages([...newMessagesData, ...prevState])
    );
  }, [newMessagesData]);

  useEffect(() => {
    if (!newMessageData) {
      return;
    }

    setChatRoomMessages((prevState) =>
      getUniqueMessages([newMessageData, ...prevState])
    );
  }, [newMessageData]);

  useEffect(() => {
    if (!paginatedMessagesData) {
      return;
    }

    setChatRoomMessages((prevState) => [
      ...prevState,
      ...paginatedMessagesData,
    ]);
  }, [paginatedMessagesData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    console.log(scrollTop, clientHeight, scrollHeight);

    if (chatRoomMessages.length === 0) {
      return;
    }

    if (scrollHeight + scrollTop <= clientHeight + 1) {
      setLastMessageId(chatRoomMessages[chatRoomMessages.length - 1].messageId);
    }
  };

  return (
    <div className="chatarea-messages" onScroll={handleScroll}>
      {chatRoomMessages
        ? chatRoomMessages.map((message, ind, arr) => (
            <Message
              ind={ind}
              key={message.messageId}
              nextMessageDate={arr[ind + 1]?.timestamp}
              messageData={message}
            />
          ))
        : null}
      {paginatedMessagesDataStatus === "loading" ? (
        <MessageLoader numberOfMessages={10} />
      ) : null}
    </div>
  );
};
