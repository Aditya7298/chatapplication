const { DBLayer } = require("../database/DBLayer");
const { checkPayloadForKeys } = require("./utils");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");

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
