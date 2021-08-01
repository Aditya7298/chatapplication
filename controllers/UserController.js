const { DBLayer } = require("../database/dbLayer.js");
const { CONTROLLER_NAMES, ERROR_MESSAGES } = require("../constants");
const { checkPayloadForKeys } = require("./utils.js");

class UserController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.USER);
  }

  getOneUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDataJSON = await this.readFromDB();
        const userData = JSON.parse(userDataJSON);

        if (!Object.keys(userData).includes(userId)) {
          reject({
            code: 404,
            message: ERROR_MESSAGES[404],
          });
        }

        resolve(userData[userId]);
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  getAllUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const userDataJSON = await this.readFromDB();
        const userData = JSON.parse(userDataJSON);
        resolve(JSON.stringify(userData));
      } catch (err) {
        reject({ ...err });
      }
    });
  }

  createUser(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          !checkPayloadForKeys(payload, [
            "userId",
            "userName",
            "personalChats",
            "groupChats",
          ])
        ) {
          reject({
            code: 400,
            message: ERROR_MESSAGES[400],
          });
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

        resolve(payload);
      } catch (err) {
        reject({ ...err });
      }
    });
  }
}

module.exports = { UserController };
