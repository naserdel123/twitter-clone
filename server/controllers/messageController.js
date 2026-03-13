const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      text,
    });
    await message.save();
    await message.populate('sender', 'username avatar');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    }).sort('createdAt').populate('sender', 'username avatar');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
