const mongoose = require("mongoose");
const isURL = require("validator/lib/isURL");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("card", cardSchema);
