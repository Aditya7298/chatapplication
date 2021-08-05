const express = require("express"),
  router = express.Router();

router.use(express.json());

const { ChatRoomController } = require("../controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

const { UserController } = require("../controllers/UserController"),
  userController = new UserController();

router.get("/:chatRoomId", async (req, res) => {
  const chatRoomId = req.params.chatRoomId;

  chatRoomController
    .getOneChatRoom(chatRoomId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.post("/", async (req, res) => {
  const payload = req.body;

  chatRoomController
    .createChatRoom(payload)
    .then((data) => {
      userController
        .addUsersToChatRooms(data)
        .then((data) => res.status(200).json(data));
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.patch("/:chatRoomId", async (req, res) => {
  const { chatRoomId } = req.params;
  const payload = req.body;
  chatRoomController
    .updateChatRoom(chatRoomId, payload)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

const chatRoomRoutes = router;

module.exports = { chatRoomRoutes };
