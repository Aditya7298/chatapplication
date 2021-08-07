const express = require("express"),
  app = express();
const cors = require("cors");

// const { appRoutes } = require("./routes/routes.js");

// app.use(cors());
// app.use("/", appRoutes);

app.get("/", (req, res) => {
  res.json({ userId: "0" });
});

const port = 8080;

app.listen(process.env.PORT || port, () => {
  console.log(`Server working on port ${port}`);
});
