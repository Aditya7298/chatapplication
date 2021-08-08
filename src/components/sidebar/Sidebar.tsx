import { useState, useCallback, useContext } from "react";

import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import { AddChatRoom } from "./addChatRoom/AddChatRoom";
import { Modal } from "../modal/Modal";

import { UserContext } from "../contexts/UserContext";

import showicon from "../../assets/images/right-arrow.svg";
import hideicon from "../../assets/images/down-arrow.svg";
import newchaticon from "../../assets/images/new-chat.svg";
import sprinklr_logo from "../../assets/images/sprinklr_logo.svg";

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

  const { userName, groupChats, personalChats } = useContext(UserContext);

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    onChatRoomPreviewClick(chatRoomId);
  };

  const handleAddChatRoomButtonClick = () => {
    setShowCreateChatRoomForm(true);
  };

  const handleCreateChatRoomFormClose = useCallback(() => {
    setShowCreateChatRoomForm(false);
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
      <img className="sidebar-logo" src={sprinklr_logo} alt="sprinklr_logo" />
      <button
        className="sidebar-addchatroom_button"
        onClick={handleAddChatRoomButtonClick}
      >
        <img src={newchaticon} alt="start a new group chat" />
      </button>
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
      </div>
    </div>
  );
};
