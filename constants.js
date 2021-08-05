const CONTROLLER_NAMES = {
  USER: "USER",
  MESSAGE: "MESSAGE",
  CHATROOM: "CHATROOM",
  LOGIN: "LOGIN",
};

const FILE_MAPPINGS = {
  [CONTROLLER_NAMES.USER]:
    "/Users/aditya/Desktop/code/chatapp-server/database/data/user_data.json",
  [CONTROLLER_NAMES.MESSAGE]:
    "/Users/aditya/Desktop/code/chatapp-server/database/data/message_data.json",
  [CONTROLLER_NAMES.CHATROOM]:
    "/Users/aditya/Desktop/code/chatapp-server/database/data/chatroom_data.json",
  [CONTROLLER_NAMES.LOGIN]:
    "/Users/aditya/Desktop/code/chatapp-server/database/data/login_data.json",
};

const ERROR_MESSAGES = {
  400: "Invalid request to the server.",
  404: "Requested Resource not found.",
  500: "Internal Server Error.",
  401: {
    USER: "User not found.",
    PASSWORD: "Incorrect password.",
    USER_SIGNUP: "Username already exists.",
  },
};

const SUCCESS_MESSAGES = {
  LOGIN: "User successfully authticated.",
};

const CHAT_ROOM_TYPE = {
  GROUP: "GROUP",
  PERSONAL: "PERSONAL",
};

module.exports = {
  CONTROLLER_NAMES,
  FILE_MAPPINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CHAT_ROOM_TYPE,
};
