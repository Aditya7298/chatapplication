const express = require("express"),
  app = express();

const { appRoutes } = require("./routes/routes.js");

app.use("/", appRoutes);

const port = 8080;

app.listen(port, () => {
  console.log(`Server working on port ${port}`);
});
