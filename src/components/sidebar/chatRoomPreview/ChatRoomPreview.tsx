import { useContext, useState, useEffect } from "react";

import { useQuery } from "../../hooks/useQuery";

import { UserContext } from "../../contexts/UserContext";

import { computePersonalChatRoomName } from "../../utils/computePersonalChatRoomName";

import { ChatRoomInfo } from "../../../types/ChatRoom.interface";

import { CHAT_ROOM_TYPE } from "../../../constants";

import "./ChatRoomPreview.css";

type ChatRoomPreviewProps = {
  chatRoomId: string;
  selectedChatRoomId: string | undefined;
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const ChatRoomPreview = ({
  chatRoomId,
  onChatRoomPreviewClick,
  selectedChatRoomId,
}: ChatRoomPreviewProps) => {
  const { userId } = useContext(UserContext);

  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const [computedChatRoomName, setComputedChatRoomName] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (chatRoomData?.type === CHAT_ROOM_TYPE.PERSONAL) {
      computePersonalChatRoomName(chatRoomId, userId).then(
        (computedChatRoomName) => {
          setComputedChatRoomName(computedChatRoomName);
        }
      );
    }
  }, [chatRoomId, userId, chatRoomData]);

  const handleClick = () => {
    onChatRoomPreviewClick(chatRoomId);
  };

  return (
    <div
      className={`chatroom-preview ${
        selectedChatRoomId === chatRoomId ? "chatroom-preview-selected" : ""
      }`}
    >
      {chatRoomData ? (
        <div onClick={handleClick}>
          <span>
            {chatRoomData.avatar && (
              <img src={chatRoomData.avatar} alt="user avatar" />
            )}
          </span>
          <span className="chatroom-preview-name">
            {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL
              ? computedChatRoomName
              : chatRoomData.chatRoomName}
          </span>
        </div>
      ) : null}
    </div>
  );
};
