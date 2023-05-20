const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  token: String,
  pseudo: String,
  email: String,
  password: String,
  adresses: [String],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "items" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
