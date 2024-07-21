require("dotenv").config();
const express = require("express");
const app = express();
const connectDatabase = require("./config/db");
const router = require("./controllers/userController");

app.use("/api/user", router);

const PORT = process.env.PORT;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
});
