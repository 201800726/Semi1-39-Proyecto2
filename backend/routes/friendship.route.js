const friendshipController = require("../controllers/friendship.controller");
const express = require("express");
const router = express.Router();

router.put("/", friendshipController.update);
router.post("/create", friendshipController.create);
router.post("/delete", friendshipController.delete);
router.get("/getFriends/:username", friendshipController.getFriends);
router.get("/getRequests/:username", friendshipController.getRequests);
router.get("/getNoFriends/:username", friendshipController.getNoFriends);

module.exports = router;
