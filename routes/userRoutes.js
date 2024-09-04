const express = require("express");
const router = express.Router();
const {
  signup,
  verifyMail,
  signin,
  getUserDetails,
  updateUser,
  userDocumentUpload,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddlware");
const upload = require("../config/multerConfig");

router.post("/auth/signup", signup);
router.get("/auth/user/verify/:id/:token", verifyMail);
router.post("/auth/signin", signin);
router.get("/auth/user/:id", authMiddleware, getUserDetails);
router.patch("/auth/user/update/:id", authMiddleware, updateUser);
router.post(
  "/user/upload/:id",
  authMiddleware,
  upload.single("file"),
  userDocumentUpload
);

module.exports = router;
