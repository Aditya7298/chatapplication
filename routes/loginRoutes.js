const express = require("express"),
  router = express.Router();

router.use(express.json());

const { LoginController } = require("../controllers/LoginController.js"),
  loginController = new LoginController();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  loginController
    .authenticateUser(username, password)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const { code, message } = err;
      res.status(code).json({ message });
    });
});

const loginRoutes = router;

module.exports = { loginRoutes };
