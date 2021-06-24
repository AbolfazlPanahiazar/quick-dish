const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const validateRestaurant = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string(),
    picture: Joi.string(),
    adminUsername: Joi.string().required(),
    adminpassword: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { validateRestaurant };
