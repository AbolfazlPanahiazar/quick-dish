const _ = require("lodash");
const bcrypt = require("bcrypt");

const RestaurantModel = require("../../models/Restaurant");
const { validateRestaurant } = require("../validator/RestaurantValidator");

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
    const data = await RestaurantModel.findOne(id).select("-adminPassword");
    if (!data) res.status(404).send("not found");
    res.send(data);
  }

  async create(req, res) {
    const { body } = req;
    const { error } = validateRestaurant(body);
    if (error) return res.status(400).send(error.message);
    const restaurant = new RestaurantModel(
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
    await restaurant.save();
    res.send(
      _.pick(restaurant, ["name", "description", "address", "adminUsername"])
    );
  }

  async update(req, res) {
    const { body } = req;
    const { params } = body;
    const { id } = params;
    const { error } = validateRestaurant(body);
    if (error) return res.status(400).send(error.message);
    const result = await RestaurantModel.findByIdAndUpdate(id, {
      $set: _.pick(
        body,
        _.pick(body, ["name", "description", "address", "adminUsername"])
      ),
    });
    if (!result) return res.status(404).send("not found");
    res.send(
      _.pick(result, ["name", "description", "address", "adminUsername"])
    );
  }

  async delete(req, res) {
    const { body } = req;
    const { params } = body;
    const { id } = params;
    const result = await RestaurantModel.findByIdAndDelete(id);
    if (!result) return res.status(404).send("not found");
    res.send(
      _.pick(result, ["name", "description", "address", "adminUsername"])
    );
  }
}

module.exports = new RestaurantController();
