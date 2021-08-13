import { useCallback, useState, useEffect } from "react";

import { ChatAreaMessages } from "./chatAreaMessages/ChatAreaMessages";
import { MessageInput } from "./messageInput/MessageInput";
import { Modal } from "../modal/Modal";
import { AddUserToGroup } from "./addUserToGroup/AddUserToGroup";
import { Snackbar } from "../snackbar/Snackbar";
import { UserLoader } from "../loaders/userLoader/UserLoader";

import { useUserContext } from "../contexts/UserContext";

import { useQuery } from "../hooks/useQuery";

import { getPersonalChatRoomInfo } from "../utils/computePersonalChatRoomName";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";
import { MessageInfo } from "../../types/Message.interface";

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

  const handleNewMessageCreation = useCallback(
    (newMessageData: MessageInfo) => {
      setNewMessageData(newMessageData);
    },
    []
  );

  const [personalChatRoomTeamMateInfo, setPersonalChatRoomTeamMateInfo] =
    useState<{ userName: string; avatar?: string }>();

  useEffect(() => {
    if (chatRoomData?.type === CHAT_ROOM_TYPE.PERSONAL) {
      getPersonalChatRoomInfo(chatRoomId, userId).then(
        ({ userName, avatar }) => {
          setPersonalChatRoomTeamMateInfo({ userName, avatar });
        }
      );
    }
  }, [chatRoomData?.type, chatRoomId, userId]);

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
                personalChatRoomTeamMateInfo ? (
                  <>
                    <img
                      src={personalChatRoomTeamMateInfo.avatar}
                      alt="teammate photograph"
                    />{" "}
                    <span>{personalChatRoomTeamMateInfo.userName}</span>
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
            newMessageData={newMessageData}
            chatRoomId={chatRoomData.chatRoomId}
          />
          <MessageInput
            chatRoomId={chatRoomId}
            onNewMessageCreation={handleNewMessageCreation}
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
