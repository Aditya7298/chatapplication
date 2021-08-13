import { MessageInfo } from "../../types/Message.interface";

export const getUniqueMessages = (messages: MessageInfo[]): MessageInfo[] => {
  const uniqueMessageIds = new Set<string>();
  return messages.filter((message) => {
    if (uniqueMessageIds.has(message.messageId)) {
      return false;
    }

    uniqueMessageIds.add(message.messageId);
    return true;
  });
};
