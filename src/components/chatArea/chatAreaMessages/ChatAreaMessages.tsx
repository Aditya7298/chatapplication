import { useEffect, useCallback } from "react";

import { Message } from "../message/Message";
import { MessageLoader } from "../../loaders/messageLoader/MessageLoader";

import { useQuery } from "../../hooks/useQuery";
import { useInfiniteQuery } from "../../hooks/useInfiniteQuery";

import { getUniqueMessages } from "./utils/getUniqueMessages";
import { ajaxClient } from "../../utils/ajaxClient";

import { MessageInfo } from "../../../types/Message.interface";
import { SentMessageType } from "../../../types/SentMessage.type";

type ChatAreaMessagesProps = {
  chatRoomId: string;
  sentMessage: SentMessageType | undefined;
  failedMessageId: string | undefined;
};

export const ChatAreaMessages = ({
  chatRoomId,
  sentMessage,
  failedMessageId,
}: ChatAreaMessagesProps) => {
  const paginatedFetchQuery = useCallback(
    (pageParam: string) =>
      ajaxClient.get({
        path: pageParam
          ? `/chatrooms/${chatRoomId}/messages/${pageParam}`
          : `/chatrooms/${chatRoomId}/messages/`,
      }),
    [chatRoomId]
  );

  const getNextPageParam = useCallback(
    (lastPage: MessageInfo[] | undefined) =>
      lastPage?.[lastPage.length - 1]?.messageId,
    []
  );

  const {
    data: chatRoomMessages,
    status: paginatedQueryStatus,
    setQueryData,
    fetchNextPage,
  } = useInfiniteQuery<MessageInfo>({
    fetchQuery: paginatedFetchQuery,
    getNextPageParam,
  });

  const { data: newMessages } = useQuery<MessageInfo[]>({
    path: `/chatrooms/${chatRoomId}/newMessages/${chatRoomMessages?.[0]?.messageId}`,
    queryInterval: 1000,
    skip: !chatRoomMessages,
  });

  useEffect(() => {
    if (!newMessages || !chatRoomMessages || newMessages.length === 0) {
      return;
    }

    setQueryData(getUniqueMessages([...newMessages, ...chatRoomMessages]));
  }, [newMessages, chatRoomMessages, setQueryData]);

  useEffect(() => {
    if (
      !chatRoomMessages ||
      !sentMessage ||
      chatRoomMessages.find(
        (message) => message.messageId === sentMessage.messageId
      )
    ) {
      return;
    }

    if (
      sentMessage.prevId &&
      chatRoomMessages.find(
        (message) => message.messageId === sentMessage.prevId
      )
    ) {
      setQueryData(
        chatRoomMessages.map((message) =>
          message.messageId === sentMessage.prevId
            ? { ...message, messageId: sentMessage.messageId }
            : message
        )
      );
    } else {
      setQueryData(getUniqueMessages([sentMessage, ...chatRoomMessages]));
    }
  }, [sentMessage, chatRoomMessages, setQueryData]);

  useEffect(() => {
    if (
      !failedMessageId ||
      !chatRoomMessages ||
      !chatRoomMessages.find((message) => message.messageId === failedMessageId)
    ) {
      return;
    }

    setQueryData(
      chatRoomMessages.filter(
        (message) => message.messageId !== failedMessageId
      )
    );
  }, [failedMessageId, setQueryData, chatRoomMessages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (!chatRoomMessages || chatRoomMessages.length === 0) {
      return;
    }

    if (
      scrollHeight + scrollTop <= clientHeight + 100 &&
      paginatedQueryStatus !== "loading"
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="chatarea-messages" onScroll={handleScroll}>
      {chatRoomMessages
        ? chatRoomMessages.map((message, ind, arr) => (
            <Message
              key={message.messageId}
              nextMessageDate={arr[ind + 1]?.timestamp}
              messageData={message}
            />
          ))
        : null}
      {paginatedQueryStatus === "loading" ? (
        <MessageLoader numberOfMessages={10} />
      ) : null}
    </div>
  );
};
