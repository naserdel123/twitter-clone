require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // أضف هذا السطر

const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');
const messageRoutes = require('./routes/messages');
const setupSocket = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/messages', messageRoutes);

// ✅ إضافة هذا الجزء لخدمة الواجهة الأمامية في الإنتاج
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

setupSocket(io);

// ✅ استخدم process.env.PORT كما هو مطلوب في Render [citation:1][citation:9]
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
