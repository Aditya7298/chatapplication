import { useCallback, useState, useEffect } from "react";

import { ChatAreaMessages } from "./chatAreaMessages/ChatAreaMessages";
import { MessageInput } from "./messageInput/MessageInput";
import { Modal } from "../modal/Modal";
import { AddUserToGroup } from "./addUserToGroup/AddUserToGroup";
import { Snackbar } from "../snackbar/Snackbar";
import { UserLoader } from "../loaders/userLoader/UserLoader";

import { useUserContext } from "../contexts/UserContext";

import { useQuery } from "../hooks/useQuery";
import { useMutation } from "../hooks/useMutation";

import { ajaxClient } from "../utils/ajaxClient";
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
  const [addUserState, setAddUserState] = useState({
    showAddUserForm: false,
    showSuccessMessage: false,
    successMessage: "",
  });

  const { userId } = useUserContext();

  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const { data: chatRoomMessages } = useQuery<MessageInfo[]>({
    path: `/chatrooms/${chatRoomId}/messages`,
    skip: !chatRoomData,
  });

  const [newMessageData, setNewMessageData] = useState<MessageInfo>();

  const { mutate } = useMutation((data) => {
    return ajaxClient.patch({
      path: `/chatrooms/${chatRoomId}/messages`,
      payload: data,
    });
  });

  const handleNewMessageCreation = useCallback(
    (newMessageData: MessageInfo) => {
      if (!chatRoomMessages) {
        return;
      }

      mutate({
        messageId: newMessageData.messageId,
      });

      setNewMessageData(newMessageData);
    },

    [chatRoomMessages, mutate]
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
          <MessageInput onNewMessageCreation={handleNewMessageCreation} />
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
