const express = require("express"),
  router = express.Router();

const { UserController } = require("../controllers/UserController");
const userController = new UserController();

const { LoginController } = require("../controllers/LoginController");
const loginController = new LoginController();

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

router.get("/filter/:query", (req, res) => {
  const query = req.params.query;

  userController
    .getFilteredUsers(query)
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
  loginController
    .createNewLoginInfo(payload)
    .then(() => {
      userController.createUser(payload).then((data) => {
        res.status(200).json(data);
      });
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

const userRoutes = router;

module.exports = { userRoutes };
