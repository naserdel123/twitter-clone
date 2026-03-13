const Tweet = require('../models/Tweet');
const User = require('../models/User');

exports.createTweet = async (req, res) => {
  try {
    const { content, image } = req.body;
    const tweet = new Tweet({
      content,
      image,
      author: req.userId,
    });
    await tweet.save();
    await tweet.populate('author', 'username avatar');
    res.status(201).json(tweet);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate('author', 'username avatar')
      .sort('-createdAt')
      .limit(50);
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });

    if (tweet.likes.includes(req.userId)) {
      tweet.likes = tweet.likes.filter(id => id.toString() !== req.userId);
    } else {
      tweet.likes.push(req.userId);
    }
    await tweet.save();
    res.json(tweet);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
