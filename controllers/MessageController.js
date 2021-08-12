const { DBLayer } = require("../database/DBLayer");
const { checkPayloadForKeys } = require("./utils");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");

const PAGE_SIZE = 10;

class MessageController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.MESSAGE);
  }

  async getOneMessage(messageId) {
    try {
      const messageDataJSON = await this.readFromDB();
      const messageData = JSON.parse(messageDataJSON);

      if (!Object.keys(messageData).includes(messageId)) {
        throw {
          code: 404,
          message: ERROR_MESSAGES[404],
        };
      }

      return messageData[messageId];
    } catch (err) {
      if (!err.code) {
        throw {
          code: 500,
          message: ERROR_MESSAGES[500],
        };
      }

      throw err;
    }
  }

  async getMultipleMessages(messageIds, lastMessageId) {
    try {
      const messageDataJSON = await this.readFromDB();
      const messageData = JSON.parse(messageDataJSON);

      const messages = Object.keys(messageData).reduce(
        (messages, messageId) =>
          messageIds.includes(messageId)
            ? [...messages, messageData[messageId]]
            : messages,
        []
      );

      messages.sort((msg1, msg2) => {
        const msg1Time = new Date(msg1.timestamp).valueOf();
        const msg2Time = new Date(msg2.timestamp).valueOf();
        return msg2Time - msg1Time;
      });

      if (lastMessageId) {
        const lastMessageIndex = messages.findIndex(
          (message) => message.messageId === lastMessageId
        );
        return messages.slice(
          lastMessageIndex + 1,
          lastMessageIndex + 1 + PAGE_SIZE
        );
      }

      return messages.slice(0, PAGE_SIZE);
    } catch (err) {
      if (!err.code) {
        throw {
          code: 500,
          message: ERROR_MESSAGES[500],
        };
      }

      throw err;
    }
  }

  async getNewMessages(messageIds, lastMessageId) {
    try {
      const messageDataJSON = await this.readFromDB();
      const messageData = JSON.parse(messageDataJSON);

      const messages = Object.keys(messageData).reduce(
        (messages, messageId) =>
          messageIds.includes(messageId)
            ? [...messages, messageData[messageId]]
            : messages,
        []
      );

      messages.sort((msg1, msg2) => {
        const msg1Time = new Date(msg1.timestamp).valueOf();
        const msg2Time = new Date(msg2.timestamp).valueOf();
        return msg2Time - msg1Time;
      });

      const lastMessageIndex = messages.findIndex(
        (message) => message.messageId === lastMessageId
      );

      if (lastMessageIndex === 0 || lastMessageIndex === -1) {
        return [];
      }

      return messages.slice(0, lastMessageIndex);
    } catch (err) {
      if (!err.code) {
        throw {
          code: 500,
          message: ERROR_MESSAGES[500],
        };
      }

      throw err;
    }
  }

  async createMessage(payload) {
    try {
      if (
        !checkPayloadForKeys(payload, [
          "messageId",
          "text",
          "senderId",
          "timestamp",
        ])
      ) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const existingMessagesJSON = await this.readFromDB();
      const existingMessages = JSON.parse(existingMessagesJSON);

      const newMessages = {
        ...existingMessages,
        [payload.messageId]: payload,
      };

      const newMessagesJSON = JSON.stringify(newMessages);

      await this.writeToDB(newMessagesJSON);

      return payload;
    } catch (err) {
      if (!err.code) {
        throw {
          code: 500,
          message: ERROR_MESSAGES[500],
        };
      }

      throw err;
    }
  }
}

module.exports = { MessageController };
