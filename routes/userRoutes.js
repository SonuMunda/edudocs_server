const express = require("express");
const router = express.Router();
const { home, signup, verifyMail } = require("../controllers/userController");


router.get("/", home);
router.post("/signup", signup);
router.get("/verify/:id/:token", verifyMail);


module.exports = router;
