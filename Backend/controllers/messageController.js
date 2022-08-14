const asynchandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModals");



const AllMessages = asynchandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const SendMessage = asynchandler(async (req, res) => {

const {chatId , content } = req.body;
if(!chatId || !content){
    console.log("Invalid data");

    return res.sendStatus(400);
}

var newMessage = {
    sender : req.user._id,
    content: content,
    chat: chatId,
}
try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender" , "name pic");
    message = await message.populate("chat");
    message =await User.populate(message,{
        path :"chats.users",
        select : "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage :message});

    res.json(message);

} catch (error) {
    res.status(400);
    throw new Error(error.message);
    
}

});

module.exports={SendMessage , AllMessages }
