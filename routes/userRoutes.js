const express = require("express"),
  router = express.Router();

const { UserController } = require("../controllers/UserController.js");
const userController = new UserController();

router.use(express.json());

router.get("/", (req, res) => {
  userController
    .getAllUsers()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  userController
    .getOneUser(userId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

router.post("/", (req, res) => {
  const payload = req.body;
  userController
    .createUser(payload)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

const userRoutes = router;

module.exports = { userRoutes };
