const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  content: { type: String, maxlength: 280, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
}, { timestamps: true });

module.exports = mongoose.model('Tweet', TweetSchema);
