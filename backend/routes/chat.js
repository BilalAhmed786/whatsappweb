const express = require('express')
const User = require('../models/users')
const Chat = require('../models/chat')
const Message = require('../models/messages')
const userAuthorize = require('../middleware/middleware');
const router = express.Router()

router.get('/messages/:id', userAuthorize, async (req, res) => {
    const userId = req.params.id;


    if (req.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const messages = await Chat.find({ users: userId }).populate({
            path: 'messages',
            match: {
                deletedBy: { $ne: userId },
                $or: [{ sender: userId }, { isblocked: false }],
            },
            populate: [
                { path: 'reactions.user', select: 'name email' },
                { path: 'media.reactions.user', select: 'name email' },
            ],
        });

        const filteredMessages = messages.map(chat => {
            chat.messages = chat.messages
                .map(message => {
                    message.media = message.media.filter(file => !file.deletedBy.includes(userId));
                    return message;
                })
                .filter(message => message.text || message.media.length > 0);

            return chat;
        });

        return res.json(filteredMessages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
});



router.get('/oneonone/:loginuser/:chatuser', userAuthorize, async (req, res) => {
  try {
    const { loginuser, chatuser } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (req.userId !== loginuser) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the chat
    const chatusermessages = await Chat.findOne({
      users: { $all: [loginuser, chatuser] },
    }).populate([
      {
        path: 'messages',
        match: {
          deletedBy: { $ne: loginuser },
          $or: [{ sender: loginuser }, { isblocked: false }],
        },
        options: {
          sort: { createdAt: -1 },   // newest first
          skip: (page - 1) * limit,
          limit: parseInt(limit),
        },
        populate: [
          { path: 'reactions.user', select: 'name' },
          { path: 'media.reactions.user', select: 'name' },
          { path: 'sender', select: 'name profilepicture' },
          { path: 'replyTo.messageId' },
        ],
      }
    ]);

    if (!chatusermessages) return res.json([]);

    // Filter messages same as before
    const filteredMessages = chatusermessages.messages
      .map(message => {
        message.media = message.media.filter(
          file => !file.deletedBy.includes(loginuser)
        );
        return message;
      })
      .filter(msg => msg.text || msg.media.length > 0);

    // Return in chronological order (oldest → newest)
    return res.json(filteredMessages.reverse());
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching chat messages.' });
  }
});




router.get('/oneononesearch/:chatuser/:search', userAuthorize, async (req, res) => { //for search messsages
    try {
        const loginuser = req.userId;
        const { chatuser, search } = req.params;

        if (!search || search.trim() === '') {
            return res.json([]);
        }

        const chatusermessages = await Chat.find({
            users: { $all: [loginuser, chatuser] },
        }).populate([
            {
                path: 'messages',
                match: {
                    deletedBy: { $ne: loginuser },
                    text: { $regex: new RegExp(search, 'i') },
                    $or: [
                        { sender: loginuser },
                        { isblocked: false },
                    ]
                },
                populate: {
                    path: "sender",
                    select: "name profilepicture"
                }
            },
        ]);

        const filteredMessages = chatusermessages.map(chat => {
            chat.messages = chat.messages
                .map(message => {
                    message.media = message.media.filter(file => !file.deletedBy.includes(loginuser));
                    return message;
                })
                .filter(message => message.text || message.media.length > 0);

            return chat;
        });

        return res.json(filteredMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching messages.' });
    }
});

router.get('/searchwindow/:chatuser/:messageId', userAuthorize, async (req, res) => {
  try {
    const { chatuser, messageId } = req.params;
    const loginuser = req.userId;

    // 1. Find the chat
    const chat = await Chat.findOne({
      users: { $all: [loginuser, chatuser] },
    });
    if (!chat) return res.json([]);

    // 2. Helper function to populate a message properly
    const populateMessage = (query) => {
      return query
        .populate('sender', 'name profilepicture')
        .populate({
          path: 'reactions.user',
          select: 'name',
        })
        .populate({
          path: 'media',
          populate: {
            path: 'reactions.user',
            select: 'name',
          },
        })
        .populate('replyTo.messageId', 'text sender');
    };

    // 3. Find the target message with proper population
    const targetMsg = await populateMessage(Message.findById(messageId));
    if (!targetMsg) return res.json([]);

    // 4. Fetch 5 messages before
    const beforeMessages = await populateMessage(
      Message.find({
        _id: { $in: chat.messages },
        createdAt: { $lt: targetMsg.createdAt },
        deletedBy: { $ne: loginuser },
        $or: [{ sender: loginuser }, { isblocked: false }],
      })
        .sort({ createdAt: -1 })
        .limit(5)
    );

    // 5. Fetch 5 messages after
    const afterMessages = await populateMessage(
      Message.find({
        _id: { $in: chat.messages },
        createdAt: { $gt: targetMsg.createdAt },
        deletedBy: { $ne: loginuser },
        $or: [{ sender: loginuser }, { isblocked: false }],
      })
        .sort({ createdAt: 1 })
        .limit(5)
    );

    // 6. Combine: before (reversed) + target + after
    const messages = [...beforeMessages.reverse(), targetMsg, ...afterMessages];

    // 7. Filter deleted messages by loginuser
    const filtered = messages
      .map((msg) => {
        msg.media = msg.media.filter((file) => !file.deletedBy.includes(loginuser));
        return msg;
      })
      .filter((msg) => msg.text || msg.media.length > 0);

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching search window messages.' });
  }
});






router.post('/reaction', userAuthorize, async (req, res) => {


    const loginuserId = req.userId;
    const { messageId, emoji, textmsg, chatuserid, isviewed } = req.body;

    try {
        const message = await Message.findById(messageId);
        const loginuser = await User.findById(loginuserId);

        if (!message) {
            return res.status(404).json('Message not found');
        }

        const userReaction = message.reactions.find(
            (reaction) => reaction.user.toString() === loginuserId
        );

        const blockbyuser = loginuser.blockedbyUsers?.some(
            (user) => user.userId.toString() === chatuserid
        );

        const blockuseradded = userReaction?.blockedbyuser.includes(chatuserid);

        if (userReaction) {
            userReaction.emoji = emoji;
            userReaction.text = textmsg;
            userReaction.isviewed = isviewed;

            if (blockbyuser && !blockuseradded) {
                userReaction.blockedbyuser.push(chatuserid);
            }

            if (!blockbyuser && blockuseradded) {
                userReaction.blockedbyuser.pull(chatuserid);
            }

        } else {
            message.reactions.push({
                text: textmsg,
                emoji: emoji,
                user: loginuserId,
                isviewed: isviewed,
                blockedbyuser: blockbyuser ? [chatuserid] : [],
            });
        }

        const savedMessage = await message.save();

        const updatedMessage = await Message.findById(savedMessage._id).populate({
            path: 'reactions.user',
            select: 'name',
        });

        return res.json({ msg: updatedMessage, receiverid: chatuserid,loginuserid:loginuserId });
    } catch (error) {
        console.error('Error saving reaction:', error);
        return res.status(500).json('Something went wrong');
    }
});


router.post('/undoreaction', userAuthorize, async (req, res) => {

    try {
        const { msgId, objectId } = req.body;
        const loginuserId = req.userId;

        // First, get the message and check ownership of the reaction
        const message = await Message.findById(msgId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const reactionToDelete = message.reactions.find(
            (reaction) => reaction._id.toString() === objectId && reaction.user.toString() === loginuserId
        );

        if (!reactionToDelete) {
            return res.status(403).json({ message: "Unauthorized to remove this reaction" });
        }

        // Now update the message by removing the reaction
        await Message.updateOne(
            { _id: msgId },
            { $pull: { reactions: { _id: objectId } } }
        );

        // Return updated message with populated reaction users
        const updatedMessage = await Message.findById(msgId).populate({
            path: 'reactions.user',
            select: 'name',
        });

        return res.json(updatedMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




router.post('/mediareaction/:msgid', userAuthorize, async (req, res) => {
    try {
        const loginuserId = req.userId;
        const { objectId, emoji, chatuserid, isviewed } = req.body;

        const msg = await Message.findById(req.params.msgid);
        const loginuser = await User.findById(loginuserId);
        if (!msg || !loginuser) return res.status(404).json("Message or user not found");

        const emojiobject = msg.media.find(media => media._id.toString() === objectId);
        if (!emojiobject) return res.status(404).json("Media not found");

        const userReaction = emojiobject.reactions.find(
            (reaction) => reaction.user.toString() === loginuserId
        );

        const blockbyuser = loginuser.blockedbyUsers?.some(user => user.userId.toString() === chatuserid);
        const blockuseradded = userReaction?.blockedbyuser.includes(chatuserid);

        if (userReaction) {
            userReaction.emoji = emoji;
            userReaction.isviewed = isviewed;

            if (blockbyuser && !blockuseradded) {
                userReaction.blockedbyuser.push(chatuserid);
            }

            if (!blockbyuser && blockuseradded) {
                userReaction.blockedbyuser.pull(chatuserid);
            }
        } else {
            emojiobject.reactions.push({
                text: emojiobject.text,
                emoji,
                user: loginuserId,
                isviewed,
                blockedbyuser: blockbyuser ? [chatuserid] : [],
            });
        }

        const savedMessage = await msg.save();

        const findmessage = await Message.findById(savedMessage._id).populate({
            path: 'media.reactions.user',
            select: 'name'
        });

        const desiredobject = findmessage.media.find(media => media._id.toString() === objectId);
        const reactionarray = desiredobject.reactions;

        return res.json({
            reaction: reactionarray,
            chatId: findmessage.chatId,
            msgId: req.params.msgid,
            objectId
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Server error");
    }
});


router.get('/mediareaction/:msgid', userAuthorize, async (req, res) => {

    if (!req.userId) {

        return res.status(401).json('unauthorize')
    }

    try {
        const mediaReaction = await Message.findById(
            req.params.msgid,
            { media: 1 }
        ).populate({
            path: 'media.reactions.user',
            select: 'name' 
        });

        return res.json(mediaReaction)


    } catch (error) {

        console.log(error)
    }


})

router.post('/undomediareaction', userAuthorize, async (req, res) => {
    try {
        const { msgId, mediaId, reactionId } = req.body;
        const loginuserId = req.userId;

        const msg = await Message.findById(msgId);
        if (!msg) return res.status(404).json({ message: "Message not found" });

        const mediaObject = msg.media.find(media => media._id.toString() === mediaId);
        if (!mediaObject) return res.status(404).json({ message: "Media not found" });

        // Check if the reaction belongs to the logged-in user
        const targetReaction = mediaObject.reactions.find(r => r._id.toString() === reactionId);
        if (!targetReaction || targetReaction.user.toString() !== loginuserId) {
            return res.status(403).json({ message: "Unauthorized to remove this reaction" });
        }

        // Remove the reaction
        mediaObject.reactions = mediaObject.reactions.filter(r => r._id.toString() !== reactionId);
        const updatedMsg = await msg.save();

        const finalMessage = await Message.findById(updatedMsg._id).populate({
            path: 'media.reactions.user',
            select: 'name'
        });

        const desiredobject = finalMessage.media.find(media => media._id.toString() === mediaId);
        const reactionarray = desiredobject.reactions;

        res.status(200).json({
            reaction: reactionarray,
            chatId: finalMessage.chatId,
            msgId,
            objectId: mediaId
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


//fwd multiple messages to multiple users
router.post('/forwardmessage', userAuthorize, async (req, res) => {
    try {
        const loginuser = req.userId;
        const { forwardmsgids, selectedUsers } = req.body;

        const originalMessages = await Message.find({ _id: { $in: forwardmsgids } });
        const forwardmessages = [];

        for (const selectedUser of selectedUsers) {
            const { chatuser, isviewed, isblocked } = selectedUser;

            // Always create chat between loginuser and chatuser
            let chat = await Chat.findOne({ users: { $all: [loginuser, chatuser] } });

            if (!chat) {
                chat = new Chat({ users: [loginuser, chatuser] });
                await chat.save();
            }

            const sanitizedMessages = [];

            for (const originalMessage of originalMessages) {
                const newMessage = new Message({
                    sender: loginuser,
                    text: originalMessage.text,
                    chatId: chat._id,
                    createdAt: Date.now(),
                    media: originalMessage.media.map(media => ({
                        ...media.toObject(),
                        reactions: [],
                        deletedBy: [],
                        createdAt: Date.now()
                    })),
                    isviewed,
                    isblocked,
                });

                await newMessage.save();
                sanitizedMessages.push(newMessage._id);

                forwardmessages.push({
                    ...newMessage.toObject(),
                    receiver: chatuser,
                });
            }

            chat.messages = [...new Set([...chat.messages, ...sanitizedMessages])];
            await chat.save();
        }

        return res.status(200).json(forwardmessages);
    } catch (error) {
        console.error('Error in forwarding messages:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




//fwd a media message to multiple users
router.post('/singlemediafwd', userAuthorize, async (req, res) => {
    try {
        const loginuser = req.userId; // from JWT token
        const { forwardmsgids, forwardmsgobjid, selectedUsers } = req.body;

        const originalMessage = await Message.findOne({ _id: { $in: forwardmsgids } });
        if (!originalMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const mediaFileToForward = originalMessage.media.find(
            (media) => media._id.toString() === forwardmsgobjid
        );

        if (!mediaFileToForward) {
            return res.status(404).json({ error: 'Media file not found in the message' });
        }

        const forwardedMessages = [];

        for (const selectedUser of selectedUsers) {
            const { chatuser, isviewed, isblocked } = selectedUser;

            let chat = await Chat.findOne({
                users: { $all: [loginuser, chatuser] },
            });

            if (!chat) {
                chat = new Chat({ users: [loginuser, chatuser] });
                await chat.save();
            }

            const sanitizedMessage = new Message({
                sender: loginuser,
                text: "",
                media: [
                    {
                        text: mediaFileToForward.text,
                        deletedBy: [],
                        reactions: [],
                        createdAt: Date.now(),
                    },
                ],
                isviewed,
                isblocked,
                chatId: chat._id,
                createdAt: Date.now(),
            });

            await sanitizedMessage.save();

            forwardedMessages.push({
                ...sanitizedMessage.toObject(),
                receiver: chatuser,
            });

            chat.messages.push(sanitizedMessage._id);
            await chat.save();
        }

        return res.status(200).json(forwardedMessages);
    } catch (error) {
        console.error("Error in forwarding media file:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});





router.delete('/singlemsgdel/:msgid', userAuthorize, async (req, res) => {
    try {
        const userId = req.userId; // Authenticated user from token
        const { msgid } = req.params;

        const updatedMessage = await Message.findByIdAndUpdate(
            msgid,
            { $addToSet: { deletedBy: userId } }, // Prevent duplicates
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ msg: 'Message not found' });
        }

        res.status(200).json({
            msg: 'Message deleted successfully for user',
            updatedMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to delete message' });
    }
});


router.post('/deletesingleMedia/:msgid', userAuthorize, async (req, res) => {
    try {
        const userId = req.userId;
        const { objectId } = req.body;

        const msg = await Message.findById(req.params.msgid);
        if (!msg) return res.status(404).json('Message not found');

        const targetMedia = msg.media.find(media => media._id.toString() === objectId);
        if (!targetMedia) return res.status(404).json('Media not found');

        // Avoid duplicate entries
        if (!targetMedia.deletedBy.includes(userId)) {
            targetMedia.deletedBy.push(userId);
        }

        await msg.save();
        return res.json('Media file deleted successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
});


router.get('/mediamessage/:chatuser', userAuthorize, async (req, res) => {
    try {
        const loginuser = req.userId;
        const chatuser = req.params.chatuser;

        const chat = await Chat.findOne({ users: { $all: [loginuser, chatuser] } }).populate([
            {
                path: 'messages',
                match: {
                    deletedBy: { $ne: loginuser },
                    $or: [
                        { sender: loginuser },
                        { isblocked: false }
                    ],
                },
                populate: {
                    path: 'sender',
                    select: 'name profilepicture',
                },
            },
        ]);

        return res.json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});


//delte multiple msgs
router.post('/deletemsgs', userAuthorize, async (req, res) => {
    try {
        const userId = req.userId;
        const { msgids } = req.body;

        await Message.updateMany(
            { _id: { $in: msgids } },
            { $addToSet: { deletedBy: userId } } // $addToSet prevents duplicates
        );

        return res.json('Selected messages deleted successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
});


//delte all msgs between two users
router.post('/clearmsgs', userAuthorize, async (req, res) => {
    try {
        const userId = req.userId;
        const { msgids } = req.body;

        await Message.updateMany(
            { _id: { $in: msgids } },
            { $addToSet: { deletedBy: userId } }
        );

        return res.json('Messages cleared successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
});



//update messages isViewed status


router.post('/isViewed', userAuthorize, async (req, res) => {
    try {
        const userId = req.userId;
        const { msgid, chatId } = req.body;

        // Step 1: Update message view status
        await Message.updateMany(
            { _id: { $lte: msgid }, chatId, sender: { $ne: userId } },
            { $set: { isviewed: true } }
        );

        const messages = await Message.find({ chatId });

        for (let message of messages) {
            let updated = false;

            message.reactions.forEach((reaction) => {
                if (reaction.user.toString() !== userId && !reaction.isviewed) {
                    reaction.isviewed = true;
                    updated = true;
                }
            });

            message.media.forEach((mediaItem) => {
                mediaItem.reactions.forEach((reaction) => {
                    if (reaction.user.toString() !== userId && !reaction.isviewed) {
                        reaction.isviewed = true;
                        updated = true;
                    }
                });
            });

            if (updated) await message.save();
        }

        return res.json({ msg: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error');
    }
});



module.exports = router