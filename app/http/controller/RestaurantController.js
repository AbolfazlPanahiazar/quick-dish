const _ = require("lodash");
const bcrypt = require("bcrypt");

const RestaurantModel = require("../../models/Restaurant");
const {
  validateCreateRestaurant,
  validateUpdateRestaurant,
  loginValidator,
} = require("../validator/RestaurantValidator");

class RestaurantController {
  async getList(req, res) {
    const list = await RestaurantModel.find()
      .select("name description score adminUsername")
      .limit(20);
    res.send(list);
  }

  async getOne(req, res) {
    const { params } = req;
    const { id } = params;
    const data = await RestaurantModel.findById(id).select("-adminPassword");
    if (!data) res.status(404).send("not found");
    res.send(data);
  }

  async create(req, res) {
    const { body } = req;
    const { error } = validateCreateRestaurant(body);
    if (error) return res.status(400).send(error.message);
    let restaurant = new RestaurantModel(
      _.pick(body, [
        "name",
        "description",
        "address",
        "adminUsername",
        "adminPassword",
      ])
    );
    const salt = await bcrypt.genSalt(10);
    restaurant.adminPassword = await bcrypt.hash(
      restaurant.adminPassword,
      salt
    );
    restaurant = await restaurant.save();
    res.send(
      _.pick(restaurant, [
        "name",
        "description",
        "address",
        "adminUsername",
        "_id",
      ])
    );
  }

  async update(req, res) {
    const { params, body } = req;
    const { id } = params;
    const { error } = validateUpdateRestaurant(body);
    if (error) return res.status(400).send(error.message);
    const result = await RestaurantModel.findByIdAndUpdate(
      id,
      {
        $set: _.pick(body, ["name", "description", "address", "adminUsername"]),
      },
      { new: true }
    );
    if (!result) return res.status(404).send("not found");
    res.send(
      _.pick(result, ["name", "description", "address", "adminUsername"])
    );
  }

  async delete(req, res) {
    const { params } = req;
    const { id } = params;
    const result = await RestaurantModel.findByIdAndDelete(id);
    if (!result) return res.status(404).send("not found");
    res.send("Deleted successfuly");
  }

  async login(req, res) {
    const { body } = req;
    const { error } = loginValidator(body);
    if (error) return res.status(400).send({ message: error.message });
    const { username, password } = body;
    let restaurant = await RestaurantModel.findOne({ adminUsername: username });
    if (!restaurant)
      return res.status(404).send({ message: "restaurant not found" });
    const result = await bcrypt.compare(password, restaurant.adminPassword);
    if (!result) return res.send(400).send({ message: "wrong password" });
    const token = restaurant.generateAuthToken();
    res.header("access-token", token).status(200).send({ success: true });
  }
}

module.exports = new RestaurantController();
