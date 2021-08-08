const CONTROLLER_NAMES = {
  USER: "USER",
  MESSAGE: "MESSAGE",
  CHATROOM: "CHATROOM",
  LOGIN: "LOGIN",
};

// const pwd = process.env.PWD;
const pwd = "/Users/aditya/Desktop/code/chatapp-server";

const FILE_MAPPINGS = {
  [CONTROLLER_NAMES.USER]: `${pwd}/database/data/user_data.json`,
  [CONTROLLER_NAMES.MESSAGE]: `${pwd}/database/data/message_data.json`,
  [CONTROLLER_NAMES.CHATROOM]: `${pwd}/database/data/chatroom_data.json`,
  [CONTROLLER_NAMES.LOGIN]: `${pwd}/database/data/login_data.json`,
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
