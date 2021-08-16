import { useCallback, useState } from "react";

import { ChatAreaMessages } from "./chatAreaMessages/ChatAreaMessages";
import { MessageInput } from "./messageInput/MessageInput";
import { Modal } from "../modal/Modal";
import { AddUserToGroup } from "./addUserToGroup/AddUserToGroup";
import { Snackbar } from "../snackbar/Snackbar";
import { UserLoader } from "../loaders/userLoader/UserLoader";

import { useUserContext } from "../contexts/UserContext";

import { useQuery } from "../hooks/useQuery";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";
import { MessageInfo } from "../../types/Message.interface";
import { UserInfo } from "../../types/User.interface";

import { CHAT_ROOM_TYPE } from "../../constants";

import addUserIcon from "../../assets/images/add-user.svg";
import loadingIcon from "../../assets/images/loading-animation.svg";

import "./ChatArea.css";

type ChatAreaProps = {
  chatRoomId: string;
};

export const ChatArea = ({ chatRoomId }: ChatAreaProps) => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string>();

  const { userId } = useUserContext();

  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const [newMessageData, setNewMessageData] = useState<MessageInfo>();

  const [failedMessageId, setFailedMessageId] = useState<string>();

  const handleNewMessageCreation = useCallback(
    (newMessageData: MessageInfo) => {
      setNewMessageData(newMessageData);
    },
    []
  );

  const handleNewMessageCreationFaliure = useCallback(
    (failedMessageId: string) => {
      setFailedMessageId(failedMessageId);
      setSnackbarMessage("Failed to send message, please try again");
    },
    []
  );

  const { data: teamMateInfo } = useQuery<UserInfo>({
    path: `/users/${
      chatRoomData?.userIds[0] === userId
        ? chatRoomData?.userIds[1]
        : chatRoomData?.userIds[0]
    }`,
    skip: !chatRoomData || chatRoomData.type === CHAT_ROOM_TYPE.GROUP,
  });

  const handleAddUserFormClose = useCallback(() => {
    setShowAddUserForm(false);
  }, []);

  const handleAddUserFormOpen = useCallback(() => {
    setShowAddUserForm(true);
  }, []);

  const handleNewUserAddition = useCallback(
    (addUserName: string) => {
      setShowAddUserForm(false);
      setSnackbarMessage(
        `${addUserName} successfully added to ${chatRoomData?.chatRoomName}`
      );
    },
    [chatRoomData?.chatRoomName]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbarMessage(undefined);
  }, []);

  return (
    <div className={`${chatRoomData ? "chatarea" : "chatarea-loading"}`}>
      {chatRoomData ? (
        <>
          <Modal open={showAddUserForm} onClose={handleAddUserFormClose}>
            <AddUserToGroup
              onNewUserAddition={handleNewUserAddition}
              chatRoomId={chatRoomId}
              chatRoomName={chatRoomData.chatRoomName}
            />
          </Modal>

          <Snackbar
            show={snackbarMessage !== undefined}
            onSnackbarClose={handleSnackbarClose}
          >
            {snackbarMessage}
          </Snackbar>

          <div className="chatarea-header">
            <span className="chatarea-header-title">
              {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL ? (
                teamMateInfo ? (
                  <>
                    <img src={teamMateInfo.avatar} alt="teammate photograph" />{" "}
                    <span>{teamMateInfo.userName}</span>
                  </>
                ) : (
                  <UserLoader />
                )
              ) : (
                `# ${chatRoomData.chatRoomName}`
              )}
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

          <ChatAreaMessages
            sentMessage={newMessageData}
            chatRoomId={chatRoomData.chatRoomId}
            failedMessageId={failedMessageId}
          />
          <MessageInput
            chatRoomId={chatRoomId}
            onNewMessageCreation={handleNewMessageCreation}
            onNewMessageCreationFaliure={handleNewMessageCreationFaliure}
          />
        </>
      ) : (
        <object
          className="chatarea-loading-indicator"
          type="image/svg+xml"
          data={loadingIcon}
        >
          svg-animation
        </object>
      )}
    </div>
  );
};
