const express = require("express"),
  app = express();
const cors = require("cors");

const { appRoutes } = require("./routes/routes");

app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "application running" });
});
app.use("/", appRoutes);

const port = 8080;

app.listen(process.env.PORT || port, () => {
  console.log(`Server working on port ${port}`);
});
