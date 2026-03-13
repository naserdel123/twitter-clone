const Message = require('../models/Message');

const users = {}; // socketId -> userId

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user after authentication
    socket.on('register', (userId) => {
      users[socket.id] = userId;
    });

    // Private messaging
    socket.on('private-message', async ({ to, text }) => {
      const senderId = users[socket.id];
      if (!senderId) return;

      // Save message to DB
      const message = new Message({
        sender: senderId,
        receiver: to,
        text,
      });
      await message.save();
      await message.populate('sender', 'username avatar');

      // Find receiver's socket
      const receiverSocketId = Object.keys(users).find(key => users[key] === to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', message);
      }
      // Emit back to sender for confirmation
      socket.emit('message-sent', message);
    });

    // WebRTC signaling
    socket.on('call-user', ({ userToCall, signal, from }) => {
      const receiverSocketId = Object.keys(users).find(key => users[key] === userToCall);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('incoming-call', { signal, from });
      }
    });

    socket.on('accept-call', ({ signal, to }) => {
      const callerSocketId = Object.keys(users).find(key => users[key] === to);
      if (callerSocketId) {
        io.to(callerSocketId).emit('call-accepted', signal);
      }
    });

    socket.on('disconnect', () => {
      delete users[socket.id];
      console.log('User disconnected');
    });
  });
};
