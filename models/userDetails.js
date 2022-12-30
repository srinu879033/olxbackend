const mongoose = require("mongoose");
const validationUtils = require("../utils/validations");
const userDetails = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: [true, "Name is Required"] },
    username: { type: String, required: [true, "Username is Required"] },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is Required"],
    },
    mailId: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "EmailId is Required"],
      validate: [validationUtils.validateEmail, "Please enter a valid Email"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userDetails", userDetails);
