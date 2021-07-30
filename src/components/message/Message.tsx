import { MessageInfo } from "../../ts/types/Message.interface";
import { useFetch } from "../hooks/useFetch";
import "./Message.css";

interface MessageProps {
  messageId: string;
}

export const Message = ({ messageId }: MessageProps) => {
  const { data: messageData } = useFetch<MessageInfo>(`/message/${messageId}`);

  return (
    <div className="message">
      <div className="message-text">{messageData.text}</div>
    </div>
  );
};
