const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const mongoose = require('mongoose');

//get all my chats
exports.allChats = async(req, res, next) => {
    try{
        // let from =mongoose.Types.ObjectId(req.userId);
        // let chats = await Chat.aggregate([   
        //     {
        //         $lookup: {
        //         from: 'User',
        //         localField: 'recipients',
        //         foreignField: '_id',
        //         as: 'recipientObj',
        //     }}
        // ])
        // .match({recipients: {$all: [{ $elemMatch: { $eq: from } }] }})
        // .project({
        //     'recipientObj.password': 0,
        //     'recipientObj.__v': 0,
        //     'recipientObj.date': 0,
        // })
        let chats = await Chat.find({recipients: { $elemMatch:{ $eq: req.userId}}})
                .populate('recipients', 'pic  firstName lastName ')
                .sort({updatedAt: -1})

        res.status(200).json({
            message: 'all chats',
            chats: chats
        })
    }
    catch(err){
        if(!err.statusCode) {
            err.statusCode = 500 
        }
        next(err)
     };
}
//by from and to not by chat id
exports.getmessage = async(req, res, next) => {
    try{
        let user1 = mongoose.Types.ObjectId(req.userId);
        let user2 = mongoose.Types.ObjectId(req.params.receiverId);
        let userReceirve = await User.findById(req.params.receiverId).select('email firstName lastName pic');
        let userSender = await User.findById(req.userId);
        if(!userReceirve){
            res.status(500).json({
                message: 'User not found',
            })
        }
        let messages = await Message.aggregate([
            {
                $lookup: {
                    from: 'User',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ]).match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })

        res.status(200).json({
            message: 'get the chat messages',
            conversations: messages,
            userReceirve: userReceirve,  //chat name
            userSender: userSender.firstName + userSender.lastName
        })

    }
    catch(err){
        if(!err.statusCode) {
            err.statusCode = 500 
        }
        next(err)
     };
}

//send message to other user
exports.createMessage = async(req, res, next) => {
    try{
        let from = mongoose.Types.ObjectId(req.userId);
        let to = mongoose.Types.ObjectId(req.params.receiverId);
        let userReceirve = await User.findById(req.params.receiverId).select('firstName lastName pic');
        let userSender = await User.findById(req.userId).select('firstName lastName pic');
        const chat =await Chat.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [req.userId, req.params.receiverId],
                lastMessage: req.body.body,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        )
        let message = new Message({
            conversation: chat._id,
            to: to,
            from: req.userId,
            body: req.body.body,
        });
        // io.getIO().emit('messages', req.body.body);
        await message.save();

        res.status(200).json({
            message: 'conversation done successfully',
            conversationId: chat,
            userReceirve: userReceirve,  //chat name
            userSender: userSender
        })
    }
        
    catch(err){
        if(!err.statusCode) {
            err.statusCode = 500 
        }
        next(err)
     };
}












