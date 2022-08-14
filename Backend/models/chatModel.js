const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [+
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("chats", chatSchema);

// create data in to database

// const main = async () => {
//   let data = new Chat({ chatName: "bindass" }); // Method to add data in database
//   let result = await data.save();
//   console.log(result);
// };

// main();

// update data in to databae
// const updatechat = async () => {
//   let data = await Chat.updateOne(
//     { chatName: "bindass" },
//     {
//       $set: { chatName: "crazyboys" },
//     }
//   );
//   console.log(data);
// };
// updatechat();

// delete data in to database
// const deletechat = async () => {
//   let data = await Chat.deleteOne({ chatName: "crazyboys" });
//   console.log(data);
// };
// deletechat();

// find data in to database
// const findchat = async () => {
//   let data = await Chat.find();
//   console.log(data);
// };
// findchat();

module.exports = Chat;
