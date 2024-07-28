require("dotenv").config();
const express = require("express");
const cors = require('cors');
const connectDatabase = require("./config/db");
const router = require("./controllers/userController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", router);

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
});
