const express = require("express"),
  router = express.Router();

const { userRoutes } = require("./userRoutes");
const { messageRoutes } = require("./messageRoutes");
const { chatRoomRoutes } = require("./chatRoomRoutes");
const { loginRoutes } = require("./loginRoutes");

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/chatrooms", chatRoomRoutes);
router.use("/login", loginRoutes);

const appRoutes = router;

module.exports = { appRoutes };
