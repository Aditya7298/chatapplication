import { useState, useEffect } from "react";
import { useQuery } from "../hooks/useQuery";
import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";
import { UserInfo } from "../../ts/types/User.interface";
import "./Main.css";

type MainProps = {
  userId: string;
};

export const Main = ({ userId }: MainProps) => {
  const { data, isLoading } = useQuery<UserInfo>({
    url: `/users/${userId}`,
    method: "GET",
  });

  const [userData, setUserData] = useState<UserInfo | undefined>();

  const [selectedChatRoomId, setSelectedChatRoomId] = useState<
    string | undefined
  >();

  useEffect(() => {
    setUserData(data);
  }, [data]);

  const handleChatRoomPreviewClick = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
  };

  return (
    <div className="main">
      {!isLoading && (
        <Sidebar
          groupChatIds={userData?.groupChats || []}
          personalChatIds={userData?.personalChats || []}
          onChatRoomPreviewClick={handleChatRoomPreviewClick}
        />
      )}
      {selectedChatRoomId && (
        <ChatArea userId={userId} chatRoomId={selectedChatRoomId} />
      )}
    </div>
  );
};
