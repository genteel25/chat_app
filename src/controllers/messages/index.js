const Message = require("../../models/messages");
const User = require("../../models/auth");

var io = require("../../../socket");

exports.sendMessage = (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;
  const message = req.body.message;

  const newMessage = new Message({ senderId, receiverId, message });

  newMessage.save(async (err, data) => {
    if (err) return res.status(400).json({ message: "Something went wrong" });
    await User.findOne({ _id: req.user.id }).exec((err, user) => {
      if (err) return res.status().json({ err });
      if (err) return res.status(400).json({ message: "User not found" });
      if (!user) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      if (user) {
        user._doc.messages.push(data._doc._id);
        data._doc.sender = true;
        console.log(data._doc.sender);
        user.save((err, success) => {
          if (err) {
            return res.status(400).json({ message: "Message cannot be sent" });
          }
          if (success) {
            User.findOne({ _id: receiverId }).exec((err, users) => {
              if (err) return res.status().json({ err });
              if (err)
                return res.status(400).json({ message: "Receiver not found" });
              if (!users) {
                return res
                  .status(400)
                  .json({ message: "Something went wrong" });
              }
              if (users) {
                users._doc.messages.push(data._doc._id);
                users.save((err, success) => {
                  if (err)
                    return res.status(400).json({
                      messages: "Message cannot be sent to the Receiver",
                    });
                  if (success) {
                    User.find()
                      .populate("messages")
                      .exec((err, data) => {
                        if (err) {
                          res
                            .status(400)
                            .json({ message: "Messages not found" });
                        }
                        if (data) {
                          io.getIO().emit("send_message", {
                            action: "create",
                            data,
                          });
                          return res
                            .status(200)
                            .json({ message: "Message sent successfully" });
                        }
                      });
                  }
                });
                // return res.status(200).json({message: "Message sent successfully"})
              }
            });
          }
        });
      }
    });
  });
};
