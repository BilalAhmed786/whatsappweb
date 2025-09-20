const path = require('path')
const fs = require('fs')
const Chat = require('../models/chat')
const Message = require('../models/messages')
const User = require('../models/users')
const upload = require('../multer/multer')
const express = require('express')
const userAuthorize  = require('../middleware/middleware');

const router = express.Router()
//all chat messages media or text
router.post('/uploads', userAuthorize, upload.any(), async (req, res) => {
  try {
    const senderId = req.userId;

    if (req.body.senderid !== senderId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const mediaFiles = req.files?.length
      ? req.files.map(file => file.originalname)
      : [];

    let chat = await Chat.findOne({
      users: { $all: [senderId, req.body.receiverid] },
    });

    if (!chat) {
      chat = new Chat({ users: [senderId, req.body.receiverid], messages: [] });
      await chat.save();
    }

    const receiver = await User.findById(req.body.receiverid);
    const isBlocked = receiver?.blockedUsers?.some(user => user.userId.toString() === senderId);

    const message = new Message({
      chatId: chat._id,
      sender: senderId,
      media: mediaFiles.map(file => ({ text: file })),
      text: req.body.message || '',
      replyTo: {
        messageId: req.body.replyid || null,
        objectId: req.body.objectid || null,
      },
      isblocked: isBlocked || false,
      isviewed: req.body.isviewed,
    });

    await Chat.findByIdAndUpdate(chat._id, { $push: { messages: message._id } });

    const lastMessage = await message.save();
    const populatedMsg = await Message.findById(lastMessage._id)
      .populate({ path: 'replyTo.messageId' });

    return res.status(200).json(populatedMsg);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ msg: 'Server not responding' });
  }
});

//for files download to local machine
router.get("/download/:filename", userAuthorize, (req, res) => {
  const fileName = path.basename(req.params.filename); // Prevent path traversal
  const ext = fileName.split('.').pop().toLowerCase();

  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const videoExtensions = ["mp4", "avi", "mov"];
  let folder = "";

  if (imageExtensions.includes(ext)) {
    folder = path.join(__dirname, "../public/images");
  } else if (videoExtensions.includes(ext)) {
    folder = path.join(__dirname, "../public/videos");
  } else {
    return res.status(400).send("Unsupported file type");
  }

  const filePath = path.join(folder, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", err);
      return res.status(404).send("File not found");
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  });
});

module.exports = router