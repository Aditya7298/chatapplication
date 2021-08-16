import { useState, useCallback } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";

import { useUserContext } from "../contexts/UserContext";
        
import "./Main.css";

export const Main = () => {
  const userData = useUserContext();

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string>();

  const handleChatRoomPreviewClick = useCallback((chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
  }, []);

  return (
    <div className="main">
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
      ) : null}
    </div>
  );
};
