import { useState, useEffect, useCallback } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { ChatArea } from "../chatArea/ChatArea";

import { useQuery } from "../hooks/useQuery";
import { useSubscription } from "../hooks/useSubscription";

import { UserInfo } from "../../types/User.interface";

import "./Main.css";

type MainProps = {
  userId: string;
};

export const Main = ({ userId }: MainProps) => {
  const { data } = useQuery<UserInfo>({
    url: `/users/${userId}`,
    method: "GET",
  });

  const [userData, setUserData] = useState<UserInfo | undefined>();

  const updateChatRooms = useCallback(
    (personalChats: string[], groupChats: string[]) => {
      setUserData((prevState) => {
        if (!prevState) {
          return prevState;
        }

        return { ...prevState, groupChats, personalChats };
      });
    },
    []
  );

  useSubscription<UserInfo>({
    subscriptionCallback: useCallback(
      (updatedUserData: UserInfo) =>
        updateChatRooms(
          updatedUserData.personalChats,
          updatedUserData.groupChats
        ),
      [updateChatRooms]
    ),
    url: `/users/${userId}`,
  });

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
      {userData && (
        <Sidebar
          userName={userData.userName}
          groupChatIds={userData.groupChats}
          personalChatIds={userData.personalChats}
          onChatRoomPreviewClick={handleChatRoomPreviewClick}
        />
      )}
      {selectedChatRoomId && (
        <ChatArea
          key={selectedChatRoomId}
          userId={userId}
          chatRoomId={selectedChatRoomId}
        />
      )}
    </div>
  );
};
