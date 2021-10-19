const friendshipController = require('../controllers/friendship.controller')
const express = require('express')
const router = express.Router()


router.post('/sendRequest', friendshipController.sendFriendRequest);
router.post('/create', friendshipController.create);

module.exports = router;