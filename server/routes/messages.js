const express = require('express');
const { sendMessage, getConversation } = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, sendMessage);
router.get('/:userId', auth, getConversation);

module.exports = router;
