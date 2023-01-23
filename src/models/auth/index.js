const { Schema, model, default: mongoose } = require("mongoose");

const AuthSchema = Schema(
  {
    name: {
      type: String,
      lowerCase: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "You need to specify an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Fill in the correct email please",
      ],
    },
    password: {
      type: String,
      required: [true, "You need to specify password"],
      min: [8, "Password must contain 8 characters or more"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "This is not a valid phone number"],
      match: [/^(\+)\d{3}[0-9]{10}$/, "Invalid phone number"],
    },
    image: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Auth", AuthSchema);
