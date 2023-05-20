const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  user_info: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  date: Date,
});

const Order = mongoose.model("orders", ordersSchema);

module.exports = Order;
