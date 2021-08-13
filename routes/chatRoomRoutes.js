const express = require("express"),
  router = express.Router();

router.use(express.json());

const { ChatRoomController } = require("../controllers/ChatRoomController"),
  chatRoomController = new ChatRoomController();

const { UserController } = require("../controllers/UserController"),
  userController = new UserController();

const { MessageController } = require("../controllers/MessageController"),
  messageController = new MessageController();

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

router.get("/:chatRoomId/newMessages/:lastMessageId", async (req, res) => {
  const chatRoomId = req.params.chatRoomId;
  const lastMessageId = req.params.lastMessageId;
  chatRoomController
    .getOneChatRoom(chatRoomId)
    .then((data) => {
      const { messageIds } = data;
      messageController
        .getNewMessages(messageIds, lastMessageId)
        .then((data) => {
          res.status(200).json(data);
        });
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.get("/:chatRoomId/messages/:lastMessageId", async (req, res) => {
  const chatRoomId = req.params.chatRoomId;
  const lastMessageId = req.params.lastMessageId;

  chatRoomController
    .getOneChatRoom(chatRoomId)
    .then((data) => {
      const { messageIds } = data;
      messageController
        .getMultipleMessages(messageIds, lastMessageId)
        .then((data) => {
          res.status(200).json(data);
        });
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.get("/:chatRoomId/messages", async (req, res) => {
  const chatRoomId = req.params.chatRoomId;

  chatRoomController
    .getOneChatRoom(chatRoomId)
    .then((data) => {
      const { messageIds } = data;
      messageController.getMultipleMessages(messageIds).then((data) => {
        res.status(200).json(data);
      });
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

router.patch("/:chatRoomId/messages", async (req, res) => {
  const { chatRoomId } = req.params;
  const payload = req.body;
  chatRoomController
    .addMessageToChatRoom(chatRoomId, payload)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.patch("/:chatRoomId/users", async (req, res) => {
  const { chatRoomId } = req.params;
  const userNames = req.body.userNames;
  chatRoomController
    .addUsersToChatRoom(chatRoomId, userNames)
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

const chatRoomRoutes = router;

module.exports = { chatRoomRoutes };
