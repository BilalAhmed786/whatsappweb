const express = require('express')
const User = require('../models/users')
const Chat = require('../models/chat')
const upload = require('../multer/multer');
const userAuthorize  = require('../middleware/middleware');

const router = express.Router()

router.get('/userdet', userAuthorize, async (req, res) => {
  const { userid, searchtext } = req.query;

  try {

    if (req.userId !== userid) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userfind = { name: { $regex: new RegExp(searchtext, 'i') } };

    const chats = await Chat.find({
      users: userid,
    }).populate([
      {
        path: 'messages',
        match: {
          text: { $regex: searchtext, $options: 'i' },
          deletedBy: { $ne: userid },
          $or: [{ sender: userid }, { isblocked: false }],
        },
      },
      {
        path: 'users',
      },
    ]);

    const chatsWithMessages = chats.filter(chat => chat.messages.length > 0);

    const userdet = await User.find(userfind)
      .where({ _id: { $ne: userid } })
      .sort({ status: -1 });

    return res.json({ users: userdet, messages: chatsWithMessages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




router.post('/profilepic', userAuthorize, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }


    if (req.userId !== req.body.userid) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      req.body.userid,
      { $set: { profilepicture: req.file.filename } },
      { new: true }
    );

    res.json({ message: 'Image uploaded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put('/updatename', userAuthorize, async (req, res) => {
  try {
    if (req.userId !== req.body.userid) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.findByIdAndUpdate(req.body.userid, {
      $set: { name: req.body.name },
    });

    return res.json('updated successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
});

router.put('/updateabout', userAuthorize, async (req, res) => {
  try {
    if (req.userId !== req.body.userid) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.findByIdAndUpdate(req.body.userid, {
      $set: { about: req.body.about },
    });

    return res.json('updated successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
});


router.delete('/deleteuser/:id', userAuthorize, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
   const user = await User.findByIdAndDelete(req.params.id);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json(user._id);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/userfwdmsg', userAuthorize, async (req, res) => {
  const { loginuser, chatuser, search } = req.query;

  if (req.userId !== loginuser) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const loginUser = await User.findById(loginuser);
    const block = loginUser.blockedUsers?.map(b => b.userId) || [];

    const users = await User.find({
      _id: { $nin: [loginuser, chatuser, ...block] },
      name: { $regex: search, $options: 'i' },
    });

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal server error');
  }
});


router.post('/blkunblk-user/:userId', userAuthorize, async (req, res) => {
  const { userId } = req.params;
  const { blockUserId } = req.body;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const user = await User.findById(userId);
    const blockbyuser = await User.findById(blockUserId);

    if (!user || !blockbyuser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyBlocked = user.blockedUsers.some(
      entry => entry.userId.toString() === blockUserId
    );

    if (alreadyBlocked) {
      await User.updateOne(
        { _id: userId },
        { $pull: { blockedUsers: { userId: blockUserId } } }
      );
      await User.updateOne(
        { _id: blockUserId },
        { $pull: { blockedbyUsers: { userId: userId } } }
      );
    } else {
      await User.updateOne(
        { _id: userId },
        { $push: { blockedUsers: { userId: blockUserId } } }
      );
      await User.updateOne(
        { _id: blockUserId },
        { $push: { blockedbyUsers: { userId: userId } } }
      );
    }

    const updatedUser = await User.findById(userId);
    const updatedBlockbyUser = await User.findById(blockUserId);

    return res.status(200).json({
      loginuser: updatedUser,
      blockuser: updatedBlockbyUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while blocking or unblocking the user' });
  }
});




router.get('/blockeduser', userAuthorize, async (req, res) => {
  try {
    if (req.userId !== req.query.userid) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const query = {
      _id: req.query.userid,
    };

    const user = await User.findOne(query).populate({
      path: "blockedUsers.userId",
      select: "name profilepicture",
      match: { name: { $regex: req.query.searchuser, $options: "i" } },
    });

    if (!user) {
      return res.json('No matching user found.');
    }

    const filteredBlockedUsers = user.blockedUsers.filter((b) => b.userId !== null);
    return res.json(filteredBlockedUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});



router.post('/unblock/:userid', userAuthorize, async (req, res) => {
  try {
    if (req.userId !== req.params.userid) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const user = await User.findById(req.params.userid);
    const blockbyuser = await User.findById(req.body.blockUserId);

    const userexist = user.blockedUsers.pull({ userId: req.body.blockUserId });
    const blockuser = blockbyuser.blockedbyUsers.pull({ userId: req.params.userid });

    if (!userexist && !blockuser) {
      return res.json('Already unblocked');
    }

    await user.save();
    await blockbyuser.save();

    const updatedUser = await User.findById(user._id);
    const updatedBlockbyUser = await User.findById(blockbyuser._id);

    return res.status(200).json({ loginuser: updatedUser, blockuser: updatedBlockbyUser });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});





module.exports = router