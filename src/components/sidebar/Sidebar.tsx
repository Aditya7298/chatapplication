import { useState } from "react";
import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import "./Sidebar.css";
import showicon from "../../assets/images/right-arrow.png";
import hideicon from "../../assets/images/arrow-down-sign-to-navigate.png";

type SidebarProps = {
  groupChatIds: string[];
  personalChatIds: string[];
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const Sidebar = ({
  groupChatIds,
  personalChatIds,
  onChatRoomPreviewClick,
}: SidebarProps) => {
  const [showGroupChats, setShowGroupChats] = useState(true);
  const [showPersonalChats, setShowPersonalChats] = useState(true);

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    onChatRoomPreviewClick(chatRoomId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-groupchats">
        <span
          className="groupchats-toggle"
          onClick={() => setShowGroupChats(!showGroupChats)}
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
        <span onClick={() => setShowPersonalChats(!showPersonalChats)}>
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
