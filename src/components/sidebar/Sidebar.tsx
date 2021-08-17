import { useState, useCallback } from "react";

import { ChatRoomPreview } from "./chatRoomPreview/ChatRoomPreview";
import { AddChatRoom } from "./addChatRoom/AddChatRoom";
import { AddTeammate } from "./addTeammate/AddTeammate";
import { Modal } from "../modal/Modal";

import { useQuery } from "../hooks/useQuery";

import { useUserContext } from "../contexts/UserContext";

import { UserInfo } from "../../types/User.interface";

import showicon from "../../assets/images/right-arrow.svg";
import hideicon from "../../assets/images/down-arrow.svg";
import newchaticon from "../../assets/images/new-chat.svg";
import sprinklr_logo from "../../assets/images/sprinklr_logo.svg";
import addTeammate from "../../assets/images/plus-sign.svg";

import "./Sidebar.css";

type SidebarProps = {
  selectedChatRoomId: string | undefined;
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const Sidebar = ({
  selectedChatRoomId,
  onChatRoomPreviewClick,
}: SidebarProps) => {
  const [showGroupChats, setShowGroupChats] = useState(true);
  const [showPersonalChats, setShowPersonalChats] = useState(true);
  const [modalForm, setModalForm] = useState<"addChatRoom" | "addTeammate">();

  const { userId, userName } = useUserContext();

  const { data: updatedUserData } = useQuery<UserInfo>({
    path: `/users/${userId}`,
    queryInterval: 1000,
  });

  const { groupChats, personalChats } = updatedUserData || {
    groupChats: [],
    personalChats: [],
  };

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    onChatRoomPreviewClick(chatRoomId);
  };

  const handleAddChatRoomButtonClick = useCallback(() => {
    setModalForm("addChatRoom");
  }, []);

  const handleCreateChatRoomFormClose = useCallback(() => {
    setModalForm(undefined);
  }, []);

  const handleAddTeammateClick = useCallback(() => {
    setModalForm("addTeammate");
  }, []);

  const handleAddTeammateFormClose = useCallback(() => {
    setModalForm(undefined);
  }, []);

  return (
    <div className="sidebar">
      <Modal
        onClose={
          modalForm === "addChatRoom"
            ? handleCreateChatRoomFormClose
            : handleAddTeammateFormClose
        }
        open={modalForm !== undefined}
      >
        {modalForm === "addChatRoom" ? (
          <AddChatRoom onNewChatRoomCreation={handleCreateChatRoomFormClose} />
        ) : (
          <AddTeammate
            currUserName={userName}
            onNewTeammateAddition={handleAddTeammateFormClose}
          />
        )}
      </Modal>
      <img className="sidebar-logo" src={sprinklr_logo} alt="sprinklr_logo" />
      <div className="sidebar-addchatroom">
        <button
          className="sidebar-addchatroom_button"
          onClick={handleAddChatRoomButtonClick}
        >
          <img src={newchaticon} alt="start a new group chat" />
        </button>
        <div className="sidebar-addchatroom_text">Create a new channel</div>
      </div>
      <div className="sidebar-groupchats">
        <button>
          <span
            className="groupchats-toggle"
            onClick={() => setShowGroupChats((prevState) => !prevState)}
          >
            <img
              className="sidebar-toogle-icon"
              src={showGroupChats ? hideicon : showicon}
              alt={showGroupChats ? "hide groups" : "show groups"}
              height="10px"
              width="10px"
            />
          </span>
        </button>
        <span className="groupchats-label">Channels</span>
        {showGroupChats ? (
          <>
            {groupChats.map((id) => (
              <ChatRoomPreview
                selectedChatRoomId={selectedChatRoomId}
                chatRoomId={id}
                key={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </>
        ) : null}
      </div>

      <div className="sidebar-personalchats">
        <button>
          <span onClick={() => setShowPersonalChats((prevState) => !prevState)}>
            <img
              className="sidebar-toogle-icon"
              src={showPersonalChats ? hideicon : showicon}
              alt={
                showPersonalChats
                  ? "hide personal messages"
                  : "show personal messages"
              }
              height="10px"
              width="10px"
            />
          </span>
        </button>
        <span>Direct messages</span>
        {showPersonalChats ? (
          <>
            {personalChats.map((id) => (
              <ChatRoomPreview
                key={id}
                selectedChatRoomId={selectedChatRoomId}
                chatRoomId={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </>
        ) : null}
        <button
          className="sidebar-addteammate"
          onClick={handleAddTeammateClick}
        >
          <img
            className="sidebar-addteammate-sign"
            src={addTeammate}
            alt="add sign"
            height="16px"
            width="16px"
          />{" "}
          Add teammates
        </button>
      </div>
    </div>
  );
};
