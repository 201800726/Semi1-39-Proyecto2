const express = require('express'); 
const router = express.Router(); 

const userController = require('../controllers/user.controller')

router.put('/', userController.updateCognito)
router.post('/register', userController.register); 
router.post('/login', userController.login); 
router.get('/photo', userController.getPhoto)
router.get('/counters/:username', userController.getCounters)

module.exports = router; 