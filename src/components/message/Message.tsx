import { MessageInfo } from "../../ts/types/Message.interface";
import { useQuery } from "../hooks/useQuery";
import "./Message.css";

type MessageProps = {
  messageId: string;
};

export const Message = ({ messageId }: MessageProps) => {
  const { data: messageData, isLoading } = useQuery<MessageInfo>({
    url: `http://localhost:8080/messages/${messageId}`,
    method: "GET",
  });

  return (
    <div className="message">
      {!isLoading && messageData && (
        <div className="message-text">{messageData && messageData.text}</div>
      )}
    </div>
  );
};
