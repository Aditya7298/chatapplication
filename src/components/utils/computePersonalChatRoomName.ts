import { ajaxClient } from "./ajaxClient";

import { ChatRoomInfo } from "../../types/ChatRoom.interface";
import { UserInfo } from "../../types/User.interface";

export const getPersonalChatRoomInfo = async (
  chatRoomId: string,
  currUserId: string
) => {
  const chatRoomPayload = await ajaxClient.get({
    path: `/chatrooms/${chatRoomId}`,
  });
  const chatRoomData: ChatRoomInfo = await chatRoomPayload.json();
  const teammateUserID = chatRoomData.userIds.find(
    (userId) => userId !== currUserId
  );
  const teammatePayload = await ajaxClient.get({
    path: `/users/${teammateUserID}`,
  });
  const teammateData: UserInfo = await teammatePayload.json();
  return { userName: teammateData.userName, avatar: teammateData.avatar };
};
