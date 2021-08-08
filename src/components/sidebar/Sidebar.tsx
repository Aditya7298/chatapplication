import { useState, useCallback, useContext } from "react";

import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import { AddChatRoom } from "./addChatRoom/AddChatRoom";
import { AddTeammate } from "../addTeammate/AddTeammate";
import { Modal } from "../modal/Modal";

import { UserContext } from "../contexts/UserContext";

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
  const [showCreateChatRoomForm, setShowCreateChatRoomForm] = useState(false);
  const [showAddTeammateForm, setShowAddTeammateForm] = useState(false);

  const { userName, groupChats, personalChats } = useContext(UserContext);

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    onChatRoomPreviewClick(chatRoomId);
  };

  const handleAddChatRoomButtonClick = useCallback(() => {
    setShowCreateChatRoomForm(true);
  }, []);

  const handleCreateChatRoomFormClose = useCallback(() => {
    setShowCreateChatRoomForm(false);
  }, []);

  const handleAddTeammateClick = useCallback(() => {
    setShowAddTeammateForm(true);
  }, []);

  const handleAddTeammateFormClose = useCallback(() => {
    setShowAddTeammateForm(false);
  }, []);

  return (
    <div className="sidebar">
      <Modal
        onClose={handleCreateChatRoomFormClose}
        open={showCreateChatRoomForm}
      >
        <AddChatRoom
          userName={userName}
          onNewChatRoomCreation={handleCreateChatRoomFormClose}
        />
      </Modal>
      <Modal onClose={handleAddTeammateFormClose} open={showAddTeammateForm}>
        <AddTeammate
          currUserName={userName}
          onNewTeammateAddition={handleAddTeammateFormClose}
        />
      </Modal>
      <img className="sidebar-logo" src={sprinklr_logo} alt="sprinklr_logo" />
      <div className="sidebar-addchatroom">
        <button
          className="sidebar-addchatroom_button"
          onClick={handleAddChatRoomButtonClick}
        >
          <img src={newchaticon} alt="start a new group chat" />
        </button>
        <div className="sidebar-addchatroom_text">Create a new group</div>
      </div>
      <div className="sidebar-groupchats">
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
        <span className="groupchats-label">groups</span>
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
        <span>personal messages</span>
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
