const express = require("express"),
  router = express.Router();

router.use(express.json());

const { LoginController } = require("../controllers/LoginController"),
  loginController = new LoginController();

router.post("/", (req, res) => {
  const { userName, password } = req.body;
  loginController
    .authenticateUser(userName, password)
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
