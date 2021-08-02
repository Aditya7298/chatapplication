import { useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";
import { UserInfo } from "../../ts/types/User.interface";
import "./Main.css";

type MainProps = {
  userId: string;
};

export const Main = ({ userId }: MainProps) => {
  const { data: userData, isLoading } = useQuery<UserInfo>({
    url: `http://localhost:8080/users/${userId}`,
    method: "GET",
  });

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null
  );

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
  };

  return (
    <div className="main">
      {!isLoading && userData && (
        <Sidebar
          groupChatIds={userData.groupChats}
          personalChatIds={userData.personalChats}
          onChatRoomPreviewClick={handleChatRoomPreviewClick}
        />
      )}
      {selectedChatRoomId && <ChatArea chatRoomId={selectedChatRoomId} />}
    </div>
  );
};
