const express = require("express")
const router = express.Router();
const {home} = require('../routes/routes');

router.get("/", home);

module.exports = router;