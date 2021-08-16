import { useQuery } from "../../hooks/useQuery";

import { useUserContext } from "../../contexts/UserContext";

import { ChatRoomInfo } from "../../../types/ChatRoom.interface";
import { UserInfo } from "../../../types/User.interface";

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
  const { userId } = useUserContext();

  const { data: chatRoomData } = useQuery<ChatRoomInfo>({
    path: `/chatrooms/${chatRoomId}`,
  });

  const { data: teamMateInfo } = useQuery<UserInfo>({
    path: `/users/${
      chatRoomData?.userIds[0] === userId
        ? chatRoomData?.userIds[1]
        : chatRoomData?.userIds[0]
    }`,
    skip: !chatRoomData || chatRoomData.type === CHAT_ROOM_TYPE.GROUP,
  });

  const handleClick = () => {
    onChatRoomPreviewClick(chatRoomId);
  };

  return (
    <>
      {chatRoomData ? (
        <div
          onClick={handleClick}
          className={`chatroom-preview ${
            selectedChatRoomId === chatRoomId ? "chatroom-preview-selected" : ""
          }`}
        >
          <span>
            {chatRoomData.avatar && (
              <img src={chatRoomData.avatar} alt="user avatar" />
            )}
          </span>
          {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL ? (
            teamMateInfo ? (
              <span className="chatroom-preview-name">
                <img
                  src={teamMateInfo.avatar}
                  height="20px"
                  width="20px"
                  alt="teammate photograph"
                />{" "}
                <span>{teamMateInfo.userName}</span>
              </span>
            ) : (
              <>
                <span className=".chatroom-personal-preview-loading-avatar"></span>
                <span className="chatroom-personal-preview-loading-name"></span>
              </>
            )
          ) : (
            <span className="chatroom-preview-name">
              {`# ${chatRoomData.chatRoomName}`}
            </span>
          )}
        </div>
      ) : (
        <div className="chatroom-preview-loading"></div>
      )}
    </>
  );
};
