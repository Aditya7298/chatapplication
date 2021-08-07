const { DBLayer } = require("../database/dbLayer");
const { LoginController } = require("../controllers/LoginController");
const { checkPayloadForKeys } = require("./utils");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");

class ChatRoomController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.CHATROOM);
    this.loginController = new LoginController();
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

      const loginInfo = await this.loginController.getLoginInfo();

      const userIds = payload.participantNames.map((id) => {
        if (!loginInfo[id]) {
          throw {
            code: 400,
            message: ERROR_MESSAGES[400],
          };
        }

        return loginInfo[id].userId;
      });

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

  async updateChatRoom(chatRoomId, payload) {
    const { key, value } = payload;
    const chatRoomProps = [
      "chatRoomId",
      "chatRoomName",
      "userIds",
      "messageIds",
      "type",
    ];

    try {
      if (!chatRoomProps.includes(key)) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const existingChatRoomsJSON = await this.readFromDB();
      const existingChatRooms = JSON.parse(existingChatRoomsJSON);

      const newChatRooms = {
        ...existingChatRooms,
        [chatRoomId]: { ...existingChatRooms[chatRoomId], [key]: value },
      };

      const newChatRoomsJSON = JSON.stringify(newChatRooms);

      await this.writeToDB(newChatRoomsJSON);

      return { ...existingChatRooms[chatRoomId], [key]: value };
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
