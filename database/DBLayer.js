const fs = require("fs");
const { resolve } = require("path");
const { FILE_MAPPINGS, ERROR_MESSAGES } = require("../constants.js");

class DBLayer {
  constructor(controllerName) {
    this.fileLocation = FILE_MAPPINGS[controllerName];
  }

  readFromDB() {
    return new Promise((resolve, reject) => {
      try {
        const data = fs.readFileSync(this.fileLocation);
        resolve(data);
      } catch (err) {
        reject({
          code: 500,
          message: ERROR_MESSAGES[500],
        });
      }
    });
  }

  writeToDB(jsonText) {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(this.fileLocation, jsonText);
        resolve("Write operation successfull !!");
      } catch (err) {
        reject({
          code: 500,
          message: ERROR_MESSAGES[500],
        });
      }
    });
  }
}

module.exports = { DBLayer };
