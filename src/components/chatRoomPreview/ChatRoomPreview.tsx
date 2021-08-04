import { useQuery } from "../hooks/useQuery";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";

type ChatRoomPreviewProps = {
  chatRoomId: string;
  onChatRoomPreviewClick: (chatRoomId: string) => void;
};

export const ChatRoomPreview = ({
  chatRoomId,
  onChatRoomPreviewClick,
}: ChatRoomPreviewProps) => {
  const { data: chatRoomData, isLoading } = useQuery<ChatRoomInfo>({
    url: `/chatrooms/${chatRoomId}`,
    method: "GET",
  });

  const handleClick = () => {
    onChatRoomPreviewClick(chatRoomId);
  };

  return (
    <li>
      {!isLoading && (
        <div onClick={handleClick}>
          <span>
            {chatRoomData?.avatar && (
              <img src={chatRoomData?.avatar} alt="user avatar" />
            )}
          </span>
          <span>{chatRoomData?.chatRoomName}</span>
        </div>
      )}
    </li>
  );
};
