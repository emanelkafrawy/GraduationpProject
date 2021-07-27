"use strict";

var express = require('express');

var chatControllers = require('../controllers/messageController');

var is_Auth = require('../middleware/isAuth');

var router = express.Router();
router.get('/', is_Auth, chatControllers.allChats);
router.get('/:receiverId', is_Auth, chatControllers.getmessage);
router.post('/:receiverId/message', is_Auth, chatControllers.createMessage);
module.exports = router;