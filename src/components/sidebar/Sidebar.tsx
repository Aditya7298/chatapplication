import { useState } from "react";
import { ChatRoomPreview } from "../chatRoomPreview/ChatRoomPreview";
import "./Sidebar.css";
import showicon from "../../assets/images/right-arrow.png";
import hideicon from "../../assets/images/arrow-down-sign-to-navigate.png";

interface SidebarProps {
  groupChatIds: string[];
  personalChatIds: string[];
  onChatRoomPreviewClick: (chatRoomId: string) => void;
}

export const Sidebar = ({
  groupChatIds,
  personalChatIds,
  onChatRoomPreviewClick,
}: SidebarProps) => {
  const [showGroupChats, setShowGroupChats] = useState(true);
  const [showPersonalChats, setShowPersonalChats] = useState(true);

  const renderGroupChatPreviews = () => (
    <ul>
      {groupChatIds.map((id) => (
        <ChatRoomPreview
          chatRoomId={id}
          key={id}
          onChatRoomPreviewClick={() => onChatRoomPreviewClick(id)}
        />
      ))}
    </ul>
  );

  const renderPersonalChatPreviews = () => (
    <ul>
      {personalChatIds.map((id) => (
        <ChatRoomPreview
          key={id}
          chatRoomId={id}
          onChatRoomPreviewClick={() => onChatRoomPreviewClick(id)}
        />
      ))}
    </ul>
  );

  const renderHideIcon = (altText: string) => (
    <img
      className="sidebar-toogle-icon"
      src={hideicon}
      alt={altText}
      height="10px"
      width="10px"
    />
  );

  const renderShowIcon = (altText: string) => (
    <img
      className="sidebar-toogle-icon"
      src={showicon}
      alt={altText}
      height="10px"
      width="10px"
    />
  );

  return (
    <div className="sidebar">
      <div className="sidebar-groupchats">
        <span
          className="groupchats-toggle"
          onClick={() => setShowGroupChats(!showGroupChats)}
        >
          {showGroupChats
            ? renderHideIcon("hide groups")
            : renderShowIcon("show groups")}
        </span>
        <span className="groupchats-label">groups</span>
        {showGroupChats && renderGroupChatPreviews()}
      </div>

      <div className="sidebar-personalchats">
        <span onClick={() => setShowPersonalChats(!showPersonalChats)}>
          {showPersonalChats
            ? renderHideIcon("hide personal messages")
            : renderShowIcon("show personal messages")}
        </span>
        <span>personal messages</span>
        {showPersonalChats && renderPersonalChatPreviews()}
      </div>
    </div>
  );
};
