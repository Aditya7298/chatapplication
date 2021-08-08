import { useState, useCallback, useContext } from "react";

import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import { AddChatRoom } from "./addChatRoom/AddChatRoom";
import { Modal } from "../modal/Modal";

import { UserContext } from "../contexts/UserContext";

import showicon from "../../assets/images/right-arrow.svg";
import hideicon from "../../assets/images/down-arrow.svg";
import newchaticon from "../../assets/images/new-chat.svg";

import "./Sidebar.css";

type SidebarProps = {
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const Sidebar = ({ onChatRoomPreviewClick }: SidebarProps) => {
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
      <div className="sidebar-addchatroom_button">
        <button onClick={handleAddChatRoomButtonClick}>
          <img
            src={newchaticon}
            className="sidebar-newchaticon"
            alt="start a new group chat"
          />
        </button>
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
          <ul>
            {groupChats.map((id) => (
              <ChatRoomPreview
                chatRoomId={id}
                key={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </ul>
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
          <ul>
            {personalChats.map((id) => (
              <ChatRoomPreview
                key={id}
                chatRoomId={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
