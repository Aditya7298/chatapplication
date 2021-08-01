const express = require("express"),
  router = express.Router();

router.use(express.json());

const { ChatRoomController } = require("../controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

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
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

const chatRoomRoutes = router;

module.exports = { chatRoomRoutes };
