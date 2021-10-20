const express = require('express')
const router = express.Router()

const postController = require('../controllers/post.controller')

router.post('/create', postController.create)
router.post('/translate', postController.translate)
router.post('/filter', postController.filter)

module.exports = router;