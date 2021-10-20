const MessageController = require("../controllers/Message.controller");
const express = require("express");
const router = express.Router();

router.post("/all", MessageController.get);

module.exports = router;
