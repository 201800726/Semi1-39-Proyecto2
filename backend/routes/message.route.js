const MessageController = require("../controllers/message.controller");
const express = require("express");
const router = express.Router();

router.post("/all", MessageController.get);

module.exports = router;
