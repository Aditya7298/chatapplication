const fs = require("fs");
const { FILE_MAPPINGS, ERROR_MESSAGES } = require("../constants.js");

class DBLayer {
  constructor(controllerName) {
    this.fileLocation = FILE_MAPPINGS[controllerName];
  }

  async readFromDB() {
    try {
      const data = fs.readFileSync(this.fileLocation);
      return data;
    } catch (err) {
      throw {
        code: 500,
        message: ERROR_MESSAGES[500],
      };
    }
  }

  async writeToDB(jsonText) {
    try {
      fs.writeFileSync(this.fileLocation, jsonText);
      return "Write operation successfull !!";
    } catch (err) {
      throw {
        code: 500,
        message: ERROR_MESSAGES[500],
      };
    }
  }
}

module.exports = { DBLayer };
