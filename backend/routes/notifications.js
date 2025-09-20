const { updateOne } = require('../models/chat')
const Notification = require('../models/notifications')
const express = require('express')
const userAuthorize =require('../middleware/middleware')


const router = express.Router()

router.post('/', userAuthorize, async (req, res) => {
  try {
    const userId = req.userId;

    // 🛑 Prevent spoofing
    if (req.body.loginuser !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { loginuser, chatuser } = req.body;

    const updatedNotification = await Notification.findOneAndUpdate(
      { loginuser },
      { chatuser },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal server error');
  }
});


router.get('/allnotification', userAuthorize, async (req, res) => {
  try {
    const userId = req.userId;
    const data = await Notification.find({ loginuser: userId });
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal server error');
  }
}); 

module.exports = router