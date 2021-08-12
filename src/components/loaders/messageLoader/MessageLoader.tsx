import "./MessageLoader.css";

type MessageLoaderProps = {
  numberOfMessages?: number;
};

export const MessageLoader = ({ numberOfMessages }: MessageLoaderProps) => {
  const Row = () => (
    <div className="message-loader">
      <div className="message-loader-left-info">
        <span className="message-loader-sender-avatar"></span>
      </div>

      <div className="message-loader-right-info">
        <div className="message-loader-info">
          <span className="message-loader-info-sendername"></span>
          <span className="message-loader-info-time"></span>
        </div>
        <div className="message-loader-text"></div>
      </div>
    </div>
  );

  return (
    <>
      {numberOfMessages ? (
        Array(numberOfMessages).map((_, ind) => <Row key={ind} />)
      ) : (
        <Row />
      )}
    </>
  );
};
