const { DBLayer } = require("../database/dblayer");
const {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CONTROLLER_NAMES,
} = require("../constants.js");

class LoginController extends DBLayer {
  constructor() {
    super(CONTROLLER_NAMES.LOGIN);
  }

  authenticateUser(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const loginDataJSON = await this.readFromDB();
        const loginData = JSON.parse(loginDataJSON);

        if (!Object.keys(loginData).includes(username)) {
          reject({
            code: 401,
            message: ERROR_MESSAGES[401].USER,
          });
        }

        if (loginData[username] === password) {
          resolve({
            message: SUCCESS_MESSAGES.LOGIN,
          });
        } else {
          reject({
            code: 401,
            message: ERROR_MESSAGES[401].PASSWORD,
          });
        }
      } catch (err) {
        reject({
          ...err,
        });
      }
    });
  }
}

module.exports = { LoginController };
