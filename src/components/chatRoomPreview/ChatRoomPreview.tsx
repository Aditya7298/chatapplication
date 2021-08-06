import { useQuery } from "../hooks/useQuery";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";

type ChatRoomPreviewProps = {
  chatRoomId: string;
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const ChatRoomPreview = ({
  chatRoomId,
  onChatRoomPreviewClick,
}: ChatRoomPreviewProps) => {
  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const handleClick = () => {
    onChatRoomPreviewClick(chatRoomId);
  };

  return (
    <li>
      {chatRoomData ? (
        <div onClick={handleClick}>
          <span>
            {chatRoomData.avatar && (
              <img src={chatRoomData.avatar} alt="user avatar" />
            )}
          </span>
          <span>{chatRoomData.chatRoomName}</span>
        </div>
      ) : null}
    </li>
  );
};
