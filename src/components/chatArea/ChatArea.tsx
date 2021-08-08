import { useCallback, useState } from "react";

import { Message } from "../message/Message";
import { MessageInput } from "./messageInput/MessageInput";
import { Modal } from "../modal/Modal";
import { AddUserForm } from "./addUserForm/AddUserForm";
import { Snackbar } from "../snackbar/Snackbar";

import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";

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
            <AddUserForm
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
              {chatRoomData.chatRoomName}
            </span>
            {chatRoomData.type === "GROUP" ? (
              <img
                onClick={handleAddUserFormOpen}
                className="chatarea-header-adduser"
                src={addUserIcon}
                alt="add user"
              />
            ) : null}
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
