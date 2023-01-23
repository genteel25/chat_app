const { Schema, model } = require("mongoose");

const ReservesSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    locationImage: {
      type: String,
      required: true,
      trim: true,
    },
    ownerImage: {
      type: String,
      trim: true,
    },
    album: {
      type: Array,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Reserves", ReservesSchema);
