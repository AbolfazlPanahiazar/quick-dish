const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

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

restaurantSchema.methods.generateAuthToken = () => {
  const data = {
    _id: this._id,
    username: this.adminUsername,
    role: "restaurant",
  };
  return jwt.sign(data, config.get("jwtPrivateKey"));
};

const model = mongoose.model("restaurant", restaurantSchema);

module.exports = model;
