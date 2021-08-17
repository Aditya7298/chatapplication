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
        <button
          onClick={handleClick}
          className={`chatroom-preview ${
            selectedChatRoomId === chatRoomId ? "chatroom-preview-selected" : ""
          }`}
        >
          {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL ? (
            teamMateInfo ? (
              <span className="chatroom-preview-name">
                <img
                  className="chatroom-preview-name_img"
                  src={teamMateInfo.avatar}
                  height="20px"
                  width="20px"
                  alt="teammate photograph"
                />{" "}
                <span className="chatroom-preview-name_text">
                  {teamMateInfo.userName}
                </span>
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
        </button>
      ) : (
        <div className="chatroom-preview-loading"></div>
      )}
    </>
  );
};
