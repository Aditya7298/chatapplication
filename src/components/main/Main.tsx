import { useState, useContext } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";

import { UserContext } from "../contexts/UserContext";

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
    <div className="main">
      {userData ? (
        <Sidebar onChatRoomPreviewClick={handleChatRoomPreviewClick} />
      ) : null}
      {selectedChatRoomId ? (
        <ChatArea key={selectedChatRoomId} chatRoomId={selectedChatRoomId} />
      ) : null}
    </div>
  );
};
