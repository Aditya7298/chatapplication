import { useState, useCallback } from "react";

import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import { AddChatRoom } from "./addChatRoom/AddChatRoom";
import { Modal } from "../modal/Modal";

import showicon from "../../assets/images/right-arrow.png";
import hideicon from "../../assets/images/arrow-down-sign-to-navigate.png";

import "./Sidebar.css";

type SidebarProps = {
  userName: string;
  groupChatIds: string[];
  personalChatIds: string[];
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const Sidebar = ({
  userName,
  groupChatIds,
  personalChatIds,
  onChatRoomPreviewClick,
}: SidebarProps) => {
  const [showGroupChats, setShowGroupChats] = useState(true);
  const [showPersonalChats, setShowPersonalChats] = useState(true);
  const [showCreateChatRoomForm, setShowCreateChatRoomForm] = useState(false);

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
        <button onClick={handleAddChatRoomButtonClick}>Add Chatroom</button>
      </div>
      <div className="sidebar-groupchats">
        <span
          className="groupchats-toggle"
          onClick={() => setShowGroupChats((prevState) => !prevState)}
        >
          {showGroupChats ? (
            <img
              className="sidebar-toogle-icon"
              src={hideicon}
              alt={"hide groups"}
              height="10px"
              width="10px"
            />
          ) : (
            <img
              className="sidebar-toogle-icon"
              src={showicon}
              alt={"show groups"}
              height="10px"
              width="10px"
            />
          )}
        </span>
        <span className="groupchats-label">groups</span>
        {showGroupChats && (
          <ul>
            {groupChatIds.map((id) => (
              <ChatRoomPreview
                chatRoomId={id}
                key={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-personalchats">
        <span onClick={() => setShowPersonalChats((prevState) => !prevState)}>
          {showPersonalChats ? (
            <img
              className="sidebar-toogle-icon"
              src={hideicon}
              alt={"hide personal messages"}
              height="10px"
              width="10px"
            />
          ) : (
            <img
              className="sidebar-toogle-icon"
              src={showicon}
              alt={"show personal messages"}
              height="10px"
              width="10px"
            />
          )}
        </span>
        <span>personal messages</span>
        {showPersonalChats && (
          <ul>
            {personalChatIds.map((id) => (
              <ChatRoomPreview
                key={id}
                chatRoomId={id}
                onChatRoomPreviewClick={handleChatRoomPreviewClick}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
