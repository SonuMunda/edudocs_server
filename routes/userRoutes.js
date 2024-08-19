const express = require("express");
const router = express.Router();
const {
  home,
  signup,
  verifyMail,
  signin,
  getUserDetails,
  updateUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddlware");

router.get("/", home);
router.post("/auth/signup", signup);
router.get("/auth/verify/:id/:token", verifyMail);
router.post("/auth/signin", signin);
router.get("/auth/user/:id", authMiddleware, getUserDetails);
router.patch("/auth/user/update/:id", authMiddleware, updateUser);

module.exports = router;
