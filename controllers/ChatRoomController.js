const { DBLayer } = require("../database/dbLayer.js");
const { checkPayloadForKeys } = require("./utils.js");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants.js");

class ChatRoomController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.CHATROOM);
  }

  getOneChatRoom(chatRoomId) {
    return new Promise(async (resolve, reject) => {
      try {
        const chatRoomDataJSON = await this.readFromDB();
        const chatRoomData = JSON.parse(chatRoomDataJSON);

        if (!Object.keys(chatRoomData).includes(chatRoomId)) {
          reject({
            code: 404,
            message: ERROR_MESSAGES[404],
          });
        }

        resolve(chatRoomData[chatRoomId]);
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  createChatRoom(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          !checkPayloadForKeys(payload, [
            "chatRoomId",
            "chatRoomName",
            "userIds",
            "messageIds",
            "type",
          ])
        ) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400],
          });
        }

        const existingChatRoomsJSON = await this.readFromDB();
        const existingChatRooms = JSON.parse(existingChatRoomsJSON);

        const newChatRooms = {
          ...existingChatRooms,
          [payload.chatRoomId]: payload,
        };

        const newChatRoomsJSON = JSON.stringify(newChatRooms);

        await this.writeToDB(newChatRoomsJSON);

        resolve(payload);
      } catch (err) {
        reject({ ...err });
      }
    });
  }
}

module.exports = { ChatRoomController };
