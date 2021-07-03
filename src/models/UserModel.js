const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  isEnable: { type: Boolean, default: false },
  isClient: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  login: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("User", userSchema);
