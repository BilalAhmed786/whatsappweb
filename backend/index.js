const express = require('express');
const cors = require('cors');
require('./database/db');
const authrouter = require('./routes/auth');
const userrouter = require('./routes/users');
const uploadfiles = require('./routes/files');
const chatmessages = require('./routes/chat');
const notifications = require('./routes/notifications');
const cookieparser = require('cookie-parser');
const socketfun = require('./socket/socket');
const path = require('path');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

// Routes
app.use('/api/auth', authrouter);
app.use('/api/users', userrouter);
app.use('/api/files', uploadfiles);
app.use('/api/chat', chatmessages);
app.use('/api/notification', notifications);

// Socket.IO Integration
socketfun(server);

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
