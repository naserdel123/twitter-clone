const express = require('express');
const { createTweet, getTweets, likeTweet } = require('../controllers/tweetController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createTweet);
router.get('/', getTweets);
router.post('/:id/like', auth, likeTweet);

module.exports = router;
