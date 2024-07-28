const express = require("express");
const router = express.Router();
const {
  home,
  signup,
  verifyMail,
  signin,
} = require("../controllers/userController");

router.get("/", home);
router.post("/auth/signup", signup);
router.get("/auth/verify/:id/:token", verifyMail);
router.post("/auth/signin", signin);

module.exports = router;
