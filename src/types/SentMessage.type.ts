import { MessageInfo } from "./Message.interface";

export type SentMessageType = MessageInfo & { prevId: string | undefined };
