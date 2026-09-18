const express = require("express");
const axios = require("axios"); // Install with: npm install axios
const Chat = require("../models/chat");
const Message = require("../models/messages");
const User = require("../models/users");
const upload = require("../multer/multer"); // Your updated Cloudinary multer configuration
const userAuthorize = require("../middleware/middleware");

const router = express.Router();

// Route: Upload chat messages (media and/or text)
router.post("/uploads", userAuthorize, upload.any(), async (req, res) => {
  try {
    const senderId = req.userId;

    if (req.body.senderid !== senderId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // req.files with multer-storage-cloudinary provides file.path as the direct Cloudinary URL
    const mediaFiles = req.files?.length
      ? req.files.map((file) => file.path)
      : [];

    let chat = await Chat.findOne({
      users: { $all: [senderId, req.body.receiverid] },
    });

    if (!chat) {
      chat = new Chat({ users: [senderId, req.body.receiverid], messages: [] });
      await chat.save();
    }

    const receiver = await User.findById(req.body.receiverid);
    const isBlocked = receiver?.blockedUsers?.some(
      (user) => user.userId.toString() === senderId,
    );

    const message = new Message({
      chatId: chat._id,
      sender: senderId,
      media: mediaFiles.map((url) => ({ text: url })), // Saves Cloudinary HTTPS URL in DB
      text: req.body.message || "",
      replyTo: {
        messageId: req.body.replyid || null,
        objectId: req.body.objectid || null,
      },
      isblocked: isBlocked || false,
      isviewed: req.body.isviewed,
    });

    await Chat.findByIdAndUpdate(chat._id, {
      $push: { messages: message._id },
    });

    const lastMessage = await message.save();
    const populatedMsg = await Message.findById(lastMessage._id).populate({
      path: "replyTo.messageId",
    });

    return res.status(200).json(populatedMsg);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ msg: "Server not responding" });
  }
});

router.get('/download', userAuthorize, async (req, res) => {
  try {
    const { url, filename } = req.query;

    if (!url) {
      return res.status(400).send('File URL is required');
    }

    // Express ALREADY decodes req.query.url automatically.
    // Clean any accidental transformation flags from the raw URL:
    const cleanUrl = url.replace('/fl_attachment/', '/');

    // Stream original document from Cloudinary
    const response = await axios({
      url: cleanUrl,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const downloadName = filename || cleanUrl.split('/').pop().split('?')[0];
    const encodedFileName = encodeURIComponent(downloadName);

    // Force browser attachment save
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${downloadName}"; filename*=UTF-8''${encodedFileName}`
    );
    res.setHeader(
      'Content-Type',
      response.headers['content-type'] || 'application/octet-stream'
    );

    response.data.pipe(res);
  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      return res.status(500).send('Error downloading document');
    }
  }
});

module.exports = router;
