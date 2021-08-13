const express = require("express"),
  router = express.Router();
router.use(express.json());

const { MessageController } = require("../controllers/MessageController");
messageController = new MessageController();

const { ChatRoomController } = require("../controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

router.get("/:messageId", (req, res) => {
  const messageId = req.params.messageId;
  messageController
    .getOneMessage(messageId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json(message);
    });
});

router.post("/", (req, res) => {
  const { chatRoomId, ...newMessageData } = req.body;
  messageController
    .createMessage(newMessageData)
    .then(() => {
      chatRoomController
        .addMessageToChatRoom(chatRoomId, {
          messageId: newMessageData.messageId,
        })
        .then((data) => {
          res.status(200).json(data);
        });
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json(message);
    });
});

const messageRoutes = router;

module.exports = { messageRoutes };
