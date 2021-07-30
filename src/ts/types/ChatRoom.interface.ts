export interface ChatRoomInfo {
  chatRoomId: string;
  chatRoomName: string;
  avatar?: string;
  userIds: string[];
  messageIds: string[];
  type: "GROUP" | "PERSONAL";
}
