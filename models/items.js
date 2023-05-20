const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  date_publish: Date,
  quantity: Number,
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
