import { useCallback, useState, useEffect } from "react";
import { VariableSizeList } from "react-window";

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

  const [chatRoomMessages, setChatRoomMessages] = useState<MessageInfo[]>([]);

  const { data: updatedChatRoomMessages } = useQuery<MessageInfo[]>({
    path: `/chatrooms/${chatRoomId}/messages`,
    queryInterval: 1000,
    skip: !chatRoomData,
  });

  useEffect(() => {
    if (!updatedChatRoomMessages) {
      return;
    }

    if (updatedChatRoomMessages.length !== chatRoomMessages.length) {
      setChatRoomMessages((prevState) => [
        ...prevState,
        ...updatedChatRoomMessages.slice(prevState.length),
      ]);
    }
  }, [updatedChatRoomMessages, chatRoomMessages.length]);

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

  const [personalChatRoomName, setPersonalChatRoomName] = useState<string>();

  useEffect(() => {
    if (chatRoomData?.type === CHAT_ROOM_TYPE.PERSONAL) {
      computePersonalChatRoomName(chatRoomId, userId).then(
        (computedChatRoomName) => {
          setPersonalChatRoomName(computedChatRoomName);
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

  const getMessageHeight = (index: number): number => {
    if (!chatRoomMessages) {
      return 0;
    }

    const messageText = chatRoomMessages[index].text;

    const messageContainerWidth =
      document.body.getBoundingClientRect().width * 0.9;

    const numOfCharactersInMessage = messageText.split("").length;

    // For 1000 pixel width one line takes at most 118 characters (approx)

    const numOfLinesInMessage = Math.ceil(
      (1000 / messageContainerWidth) * (numOfCharactersInMessage / 118)
    );

    // 17 is the font line-height and 50 is the base height for only one line rest 20 is just to be safe.

    const lineHeight = 17;
    const baseHeight = 50;
    const extraOffset = 20;
    const messageHeight =
      lineHeight * (numOfLinesInMessage - 1) + baseHeight + extraOffset;

    return messageHeight;
  };

  const messageRow = useCallback(
    ({ index, style }: { index: number; style: object }) => (
      <>
        {chatRoomMessages ? (
          <div style={style}>
            <Message
              key={chatRoomMessages[index].messageId}
              messageData={chatRoomMessages[index]}
            />
          </div>
        ) : null}
      </>
    ),
    [chatRoomMessages]
  );

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
                ? personalChatRoomName
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

          {chatRoomMessages ? (
            <div className="chatarea-messages">
              <VariableSizeList
                itemCount={chatRoomMessages.length}
                itemSize={getMessageHeight}
                height={1000}
                width={"100%"}
              >
                {messageRow}
              </VariableSizeList>
            </div>
          ) : null}

          <MessageInput onNewMessageCreation={handleNewMessageCreation} />
        </>
      ) : null}
    </div>
  );
};
