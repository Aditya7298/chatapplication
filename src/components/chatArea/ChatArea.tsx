import { useCallback, useState, useEffect } from "react";

import { Message } from "./message/Message";
import { MessageInput } from "./messageInput/MessageInput";
import { Modal } from "../modal/Modal";
import { AddUserToGroup } from "./addUserToGroup/AddUserToGroup";
import { Snackbar } from "../snackbar/Snackbar";

import { useUserContext } from "../contexts/UserContext";

import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";
import { computePersonalChatRoomName } from "../utils/computePersonalChatRoomName";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";
import { MessageInfo } from "../../types/Message.interface";

import { CHAT_ROOM_TYPE } from "../../constants";

import addUserIcon from "../../assets/images/add-user.svg";

import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
};

export const ChatArea = ({ chatRoomId }: ChatAreaProps) => {
  const [addUserState, setAddUserState] = useState({
    showAddUserForm: false,
    showSuccessMessage: false,
    successMessage: "",
  });

  const { userId } = useUserContext();

  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const [skipChatRoomMessagesQuery, setSkipChatRoomMessagesQuery] =
    useState(true);

  useEffect(() => {
    if (chatRoomData) {
      setSkipChatRoomMessagesQuery(false);
    }
  }, [chatRoomData]);

  const { data: chatRoomMessages } = useQuery<MessageInfo[]>({
    path: `/chatrooms/${chatRoomId}/messages`,
    interval: 1000,
    skip: skipChatRoomMessagesQuery,
  });

  const { mutate } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}`,
      payload: data,
    });
  });

  const handleNewMessageCreation = useCallback(
    (newMessageId: string) => {
      if (!chatRoomMessages) {
        return;
      }

      const existingMessageIds = chatRoomMessages.map(
        (message) => message.messageId
      );

      const updatedMessageIds = [...existingMessageIds, newMessageId];

      mutate({
        key: "messageIds",
        value: updatedMessageIds,
      });
    },

    [chatRoomMessages, mutate]
  );

  const [computedChatRoomName, setComputedChatRoomName] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (chatRoomData?.type === CHAT_ROOM_TYPE.PERSONAL) {
      computePersonalChatRoomName(chatRoomId, userId).then(
        (computedChatRoomName) => {
          setComputedChatRoomName(computedChatRoomName);
        }
      );
    }
  }, [chatRoomId, userId, chatRoomData]);

  const handleAddUserFormClose = useCallback(() => {
    setAddUserState((prevState) => ({ ...prevState, showAddUserForm: false }));
  }, []);

  const handleAddUserFormOpen = useCallback(() => {
    setAddUserState((prevState) => ({ ...prevState, showAddUserForm: true }));
  }, []);

  const handleNewUserAddition = useCallback(
    (addUserName: string) => {
      setAddUserState({
        showAddUserForm: false,
        showSuccessMessage: true,
        successMessage: `${addUserName} successfully added to ${chatRoomData?.chatRoomName}`,
      });
    },
    [chatRoomData?.chatRoomName]
  );

  const handleSnackbarClose = useCallback(() => {
    setAddUserState((prevState) => ({
      ...prevState,
      showSuccessMessage: false,
      successMessage: "",
    }));
  }, []);

  return (
    <div className="chatarea">
      {chatRoomData ? (
        <>
          <Modal
            open={addUserState.showAddUserForm}
            onClose={handleAddUserFormClose}
          >
            <AddUserToGroup
              onNewUserAddition={handleNewUserAddition}
              chatRoomId={chatRoomId}
              chatRoomName={chatRoomData.chatRoomName}
            />
          </Modal>

          {addUserState.showSuccessMessage ? (
            <Snackbar onSnackbarClose={handleSnackbarClose}>
              {addUserState.successMessage}
            </Snackbar>
          ) : null}

          <div className="chatarea-header">
            <span className="chatarea-header-title">
              {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL
                ? computedChatRoomName
                : chatRoomData.chatRoomName}
            </span>
            {chatRoomData.type === "GROUP" ? (
              <div className="chatarea-header-adduser">
                <button className="chatarea-header-adduser-button">
                  <img
                    onClick={handleAddUserFormOpen}
                    className="chatarea-header-adduser_icon"
                    src={addUserIcon}
                    alt="add user"
                  />
                </button>
                <span className="chatarea-header-adduser_text">
                  Add user to {chatRoomData.chatRoomName}
                </span>
              </div>
            ) : null}
          </div>

          <div className="chatarea-messages">
            {chatRoomMessages
              ? chatRoomMessages
                  .slice(0)
                  .reverse()
                  .map((message, ind, arr) => (
                    <Message
                      key={message.messageId}
                      nextMessageDate={arr[ind + 1]?.timestamp}
                      messageData={message}
                    />
                  ))
              : null}
          </div>
          <MessageInput onNewMessageCreation={handleNewMessageCreation} />
        </>
      ) : null}
    </div>
  );
};
