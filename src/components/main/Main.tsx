import { useState, useContext } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";

import { UserContext } from "../contexts/UserContext";

import loadingIcon from "../../assets/images/loading-animation.svg";

import "./Main.css";

export const Main = () => {
  const userData = useContext(UserContext);

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<
    string | undefined
  >();

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
  };

  return (
    <div className={`${userData ? "main" : "main-loading"}`}>
      {userData ? (
        <>
          <div className="main-header">
            <img
              className="main-header-avatar"
              src={userData.avatar}
              alt="user avatar"
            />
            <span className="main-header-username">{userData.userName}</span>
          </div>
          <div className="main-content">
            <Sidebar
              selectedChatRoomId={selectedChatRoomId}
              onChatRoomPreviewClick={handleChatRoomPreviewClick}
            />
            {selectedChatRoomId ? (
              <ChatArea
                key={selectedChatRoomId}
                chatRoomId={selectedChatRoomId}
              />
            ) : (
              <h1 className="main-nochatroom-message">
                Select an existing chatroom or create a new one to start a
                conversation...
              </h1>
            )}
          </div>
        </>
      ) : (
        <object
          className="main-loading-indicator"
          type="image/svg+xml"
          data={loadingIcon}
        >
          svg-animation
        </object>
      )}
    </div>
  );
};
