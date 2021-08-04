const { DBLayer } = require("../database/dbLayer.js");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");
const { checkPayloadForKeys } = require("./utils.js");

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

  async createUser(payload) {
    try {
      if (
        !checkPayloadForKeys(payload, [
          "userId",
          "userName",
          "personalChats",
          "groupChats",
        ])
      ) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const existingUsersJSON = await this.readFromDB();
      const existingUsers = JSON.parse(existingUsersJSON);

      const newUsers = {
        ...existingUsers,
        [payload.userId]: {
          ...payload,
        },
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
}

module.exports = { UserController };
