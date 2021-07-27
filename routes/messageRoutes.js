const express = require('express');

const chatControllers = require('../controllers/messageController');
const is_Auth = require('../middleware/isAuth');

const router = express.Router();

router.get('/',is_Auth, chatControllers.allChats);


router.get('/:receiverId',is_Auth, chatControllers.getmessage);

router.post('/:receiverId/message',is_Auth, chatControllers.createMessage);

module.exports = router;