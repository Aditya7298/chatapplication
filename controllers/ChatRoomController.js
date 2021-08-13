const { DBLayer } = require("../database/DBLayer");
const { checkPayloadForKeys } = require("./utlils/checkPayloadForKeys");
const { getUserIdsFromUserNames } = require("./utlils/getUserIdsFromUserNames");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");

class ChatRoomController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.CHATROOM);
  }

  async getOneChatRoom(chatRoomId) {
    try {
      const chatRoomDataJSON = await this.readFromDB();
      const chatRoomData = JSON.parse(chatRoomDataJSON);

      if (!Object.keys(chatRoomData).includes(chatRoomId)) {
        throw {
          code: 404,
          message: ERROR_MESSAGES[404],
        };
      }

      return chatRoomData[chatRoomId];
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

  async createChatRoom(payload) {
    try {
      if (
        !checkPayloadForKeys(payload, [
          "chatRoomId",
          "chatRoomName",
          "participantNames",
          "messageIds",
          "type",
        ])
      ) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const userIds = await getUserIdsFromUserNames(payload.participantNames);

      if (userIds.length === 0) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const existingChatRoomsJSON = await this.readFromDB();
      const existingChatRooms = JSON.parse(existingChatRoomsJSON);
      const { participantNames, ...newChatRoomData } = payload;
      newChatRoomData.userIds = userIds;

      const newChatRooms = {
        ...existingChatRooms,
        [newChatRoomData.chatRoomId]: newChatRoomData,
      };

      const newChatRoomsJSON = JSON.stringify(newChatRooms);

      await this.writeToDB(newChatRoomsJSON);

      return newChatRoomData;
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

  async addMessageToChatRoom(chatRoomId, payload) {
    try {
      const { messageId } = payload;
      const existingChatRoomsJSON = await this.readFromDB();
      const existingChatRooms = JSON.parse(existingChatRoomsJSON);

      const newChatRooms = {
        ...existingChatRooms,
        [chatRoomId]: {
          ...existingChatRooms[chatRoomId],
          messageIds: [...existingChatRooms[chatRoomId].messageIds, messageId],
        },
      };

      const newChatRoomsJSON = JSON.stringify(newChatRooms);

      await this.writeToDB(newChatRoomsJSON);

      return newChatRooms[chatRoomId].messageIds;
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

  async addUsersToChatRoom(chatRoomId, userNames) {
    try {
      const existingChatRoomsJSON = await this.readFromDB();
      const existingChatRooms = JSON.parse(existingChatRoomsJSON);

      const userIds = await getUserIdsFromUserNames(userNames);

      if (userIds.length === 0) {
        throw {
          code: 400,
          message: "Entered users do not exist...",
        };
      }

      const newChatRooms = {
        ...existingChatRooms,
        [chatRoomId]: {
          ...existingChatRooms[chatRoomId],
          userIds: [
            ...new Set([...existingChatRooms[chatRoomId].userIds, ...userIds]),
          ],
        },
      };

      const newChatRoomsJSON = JSON.stringify(newChatRooms);

      await this.writeToDB(newChatRoomsJSON);

      return newChatRooms[chatRoomId];
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

module.exports = { ChatRoomController };
