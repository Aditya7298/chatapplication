const { DBLayer } = require("../database/DBLayer");
const {
  CONTROLLER_NAMES,
  ERROR_MESSAGES,
  CHAT_ROOM_TYPE,
  SAMPLE_AVATARS,
} = require("../constants");
const { checkPayloadForKeys } = require("./utlils/checkPayloadForKeys");

class UserController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.USER);
  }

  async getOneUser(userId) {
    try {
      const userDataJSON = await this.readFromDB();
      const userData = JSON.parse(userDataJSON);

      if (!Object.keys(userData).includes(userId)) {
        throw {
          code: 404,
          message: ERROR_MESSAGES[404],
        };
      }

      return userData[userId];
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

  async getAllUsers() {
    try {
      const userDataJSON = await this.readFromDB();
      const userData = JSON.parse(userDataJSON);
      return userData;
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

  async getFilteredUsers(query) {
    try {
      const userDataJSON = await this.readFromDB();
      const userData = JSON.parse(userDataJSON);
      return Object.keys(userData).reduce((list, userId) => {
        const { userName, avatar } = userData[userId];

        if (userName.toLowerCase().startsWith(query.toLowerCase())) {
          list = [...list, { userName, avatar }];
        }

        return list;
      }, []);
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

  async getUserIdsFromUsername(userNames) {
    try {
      const userDataJSON = await this.readFromDB();
      const userData = JSON.parse(userDataJSON);

      return Object.keys(userData).filter((userId) =>
        userNames.includes(userData[userId].userName)
      );
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

  async createUser(payload) {
    try {
      if (
        !checkPayloadForKeys(payload, [
          "userId",
          "userName",
          "personalChats",
          "groupChats",
          "avatar",
        ])
      ) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const existingUsersJSON = await this.readFromDB();
      const existingUsers = JSON.parse(existingUsersJSON);
      const { password, ...newUserData } = payload;

      if (!newUserData.avatar) {
        const randomAvatarIndex = Math.floor(
          Math.random() * SAMPLE_AVATARS.length
        );
        newUserData.avatar = SAMPLE_AVATARS[randomAvatarIndex];
      }

      const newUsers = {
        ...existingUsers,
        [newUserData.userId]: newUserData,
      };

      const newUsersJSON = JSON.stringify(newUsers);

      await this.writeToDB(newUsersJSON);

      return { userId: payload.userId };
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

  async addUsersToChatRooms(payload) {
    try {
      if (!checkPayloadForKeys(payload, ["userIds", "chatRoomId", "type"])) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const { chatRoomId, userIds, type } = payload;

      const usersDataJSON = await this.readFromDB();
      const usersData = JSON.parse(usersDataJSON);

      const newUsersData = Object.keys(usersData).reduce(
        (newUsersData, userId) => {
          newUsersData[userId] = usersData[userId];

          if (
            userIds.includes(userId) &&
            !(
              usersData[userId].groupChats.includes(chatRoomId) ||
              usersData[userId].personalChats.includes(chatRoomId)
            )
          ) {
            if (type === CHAT_ROOM_TYPE.GROUP) {
              newUsersData[userId] = {
                ...usersData[userId],
                groupChats: [...usersData[userId].groupChats, chatRoomId],
              };
            } else {
              newUsersData[userId] = {
                ...usersData[userId],
                personalChats: [...usersData[userId].personalChats, chatRoomId],
              };
            }
          }

          return newUsersData;
        },
        {}
      );

      await this.writeToDB(JSON.stringify(newUsersData));
      return { chatRoomId };
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

module.exports = { UserController };
