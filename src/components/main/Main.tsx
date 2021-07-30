import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";
import { UserInfo } from "../../ts/types/User.interface";
import "./Main.css";

interface MainProps {
  userId: string;
}

export const Main = ({ userId }: MainProps) => {
  const { data: userData, isLoading } = useFetch<UserInfo>(`/user/${userId}`);

  const [selectedChatRoomId, setSelectedChatRoomId] = useState("");

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
  };

  return (
    <div className="main">
      {!isLoading && (
        <Sidebar
          groupChatIds={userData.groupChats}
          personalChatIds={userData.personalChats}
          onChatRoomPreviewClick={handleChatRoomPreviewClick}
        />
      )}
      {selectedChatRoomId.length > 0 && (
        <ChatArea chatRoomId={selectedChatRoomId} />
      )}
    </div>
  );
};
