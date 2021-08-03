const { DBLayer } = require("../database/dblayer");
const { ERROR_MESSAGES, CONTROLLER_NAMES } = require("../constants.js");

class LoginController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.LOGIN);
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
}

module.exports = { LoginController };
