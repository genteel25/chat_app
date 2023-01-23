const { Schema, model } = require("mongoose");

const MessageSchema = Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
