const { DBLayer } = require("../database/dblayer");
const { checkPayloadForKeys } = require("./utils.js");
const { ERROR_MESSAGES, CONTROLLER_NAMES } = require("../constants.js");

class LoginController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.LOGIN);
  }

  async getLoginInfo() {
    try {
      const loginDataJSON = await this.readFromDB();
      const loginData = JSON.parse(loginDataJSON);
      return loginData;
    } catch (err) {
      throw {
        code: 500,
        message: ERROR_MESSAGES[500],
      };
    }
  }

  async authenticateUser(username, password) {
    try {
      const loginDataJSON = await this.readFromDB();
      const loginData = JSON.parse(loginDataJSON);

      if (!Object.keys(loginData).includes(username)) {
        throw {
          code: 401,
          message: ERROR_MESSAGES[401].USER,
        };
      }

      if (loginData[username].password === password) {
        return {
          userId: loginData[username].userId,
        };
      } else {
        throw {
          code: 401,
          message: ERROR_MESSAGES[401].PASSWORD,
        };
      }
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

  async createNewLoginInfo(payload) {
    try {
      if (!checkPayloadForKeys(payload, ["userId", "userName", "password"])) {
        throw {
          code: 400,
          message: ERROR_MESSAGES[400],
        };
      }

      const { userName, password, userId } = payload;

      const loginDataJSON = await this.readFromDB();
      const loginData = JSON.parse(loginDataJSON);
      if (Object.keys(loginData).includes(userName)) {
        throw {
          code: 401,
          message: ERROR_MESSAGES[401].USER_SIGNUP,
        };
      } else {
        const newLoginData = { ...loginData, [userName]: { password, userId } };
        const newLoginDataJSON = JSON.stringify(newLoginData);
        await this.writeToDB(newLoginDataJSON);
      }
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

module.exports = { LoginController };
