import { useFetch } from "../hooks/useFetch";
import { ChatRoomInfo } from "../../ts/types/ChatRoom.interface";

interface ChatRoomPreviewProps {
  chatRoomId: string;
  onChatRoomPreviewClick: () => void;
}

export const ChatRoomPreview = ({
  chatRoomId,
  onChatRoomPreviewClick,
}: ChatRoomPreviewProps) => {
  const { data: chatRoomData } = useFetch<ChatRoomInfo>(
    `chatroom/${chatRoomId}`
  );
  const { chatRoomName, avatar } = chatRoomData;

  return (
    <li>
      <div onClick={onChatRoomPreviewClick}>
        <span>{avatar && <img src={avatar} alt="user avatar" />}</span>
        <span>{chatRoomName}</span>
      </div>
    </li>
  );
};
