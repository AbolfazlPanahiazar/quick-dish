const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  score: Number,
});

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  score: Number,
  price: { type: Number, required: true },
  picture: String,
  comments: [commentSchema],
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  score: { type: Number, default: 0 },
  address: String,
  picture: String,
  comment: [commentSchema],
  menu: [foodSchema],
  adminUsername: { type: String, required: true },
  adminPassword: { type: String, required: true },
});

const model = mongoose.model("restaurant", restaurantSchema);

module.exports = model;