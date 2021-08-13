import { useContext, useState, useEffect } from "react";

import { useQuery } from "../../hooks/useQuery";

import { UserContext } from "../../contexts/UserContext";

import { getPersonalChatRoomInfo } from "../../utils/computePersonalChatRoomName";

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

  const [teamMateInfo, setTeamMateInfo] =
    useState<{ userName: string; avatar: string | undefined }>();

  useEffect(() => {
    if (chatRoomData?.type === CHAT_ROOM_TYPE.PERSONAL) {
      getPersonalChatRoomInfo(chatRoomId, userId).then(
        ({ userName, avatar }) => {
          setTeamMateInfo({ userName, avatar });
        }
      );
    }
  }, [chatRoomId, userId, chatRoomData]);

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
          <span className="chatroom-preview-name">
            {chatRoomData.type === CHAT_ROOM_TYPE.PERSONAL ? (
              teamMateInfo ? (
                <>
                  <img
                    src={teamMateInfo.avatar}
                    height="20px"
                    width="20px"
                    alt="teammate photograph"
                  />{" "}
                  <span>{teamMateInfo.userName}</span>
                </>
              ) : (
                <div className="chatroom-preview-loading"></div>
              )
            ) : (
              `# ${chatRoomData.chatRoomName}`
            )}
          </span>
        </div>
      ) : (
        <div className="chatroom-preview-loading"></div>
      )}
    </>
  );
};
