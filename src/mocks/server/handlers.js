import { rest } from "msw";
import { loginData } from "../data/Login.mockdata";
import { userData } from "../data/User.mockdata";
import { chatRooms } from "../data/ChatRooms.mockdata";
import { messageData } from "../data/Message.mockdata";
// import { fetchJSONFile } from "./utils";

export const handlers = [
  rest.post("/login", async (req, res, ctx) => {
    const { username, password } = req.body;

    if (Object.keys(loginData).indexOf(username) === -1) {
      return res(
        ctx.delay(1000),
        ctx.status(401),
        ctx.json({
          message: "User not found !!",
        })
      );
    } else if (loginData[username] !== password) {
      return res(
        ctx.delay(1000),
        ctx.status(401),
        ctx.json({
          message: "Incorrect Password !!",
        })
      );
    } else {
      return res(
        ctx.delay(1000),
        ctx.status(200),
        ctx.json({
          userId: username,
        })
      );
    }
  }),

  rest.get("/user/:userName", (req, res, ctx) => {
    const userName = req.params.userName;
    if (!Object.keys(userData).includes(userName)) {
      return res(
        ctx.status(404),
        ctx.json({ message: "User data not found !!" })
      );
    } else {
      return res(ctx.status(200), ctx.json(userData[userName]));
    }
  }),

  rest.get("/chatroom/:chatroomid", (req, res, ctx) => {
    const chatRoomId = req.params.chatroomid;

    if (!Object.keys(chatRooms).includes(chatRoomId)) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Chat room not found !!" })
      );
    } else {
      return res(ctx.status(200), ctx.json(chatRooms[chatRoomId]));
    }
  }),

  rest.get("/message/:messageid", (req, res, ctx) => {
    const messageId = req.params.messageid;

    if (!Object.keys(messageData).includes(messageId)) {
      return res(ctx.status(404), ctx.json({ message: "Message not found!!" }));
    } else {
      return res(ctx.status(200), ctx.json(messageData[messageId]));
    }
  }),
];
