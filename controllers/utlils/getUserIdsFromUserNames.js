const { UserController } = require("../UserController");
const { ERROR_MESSAGES } = require("../../constants");

const getUserIdsFromUserNames = async (userNames) => {
  try {
    const userController = new UserController();
    const userIds = await userController.getUserIdsFromUsername(userNames);
    return userIds;
  } catch (err) {
    if (!err.code) {
      throw {
        code: 500,
        message: ERROR_MESSAGES[500],
      };
    }

    throw err;
  }
};

module.exports = { getUserIdsFromUserNames };
