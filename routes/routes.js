const express = require("express"),
  router = express.Router();

const { userRoutes } = require("./userRoutes.js");
const { messageRoutes } = require("./messageRoutes.js");
const { chatRoomRoutes } = require("./chatRoomRoutes.js");
const { loginRoutes } = require("./loginRoutes.js");

router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/chatrooms", chatRoomRoutes);
router.use("/login", loginRoutes);

const appRoutes = router;

module.exports = { appRoutes };
