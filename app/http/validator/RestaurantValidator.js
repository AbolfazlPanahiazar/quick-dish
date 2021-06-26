const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const validateCreateRestaurant = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string(),
    picture: Joi.string(),
    adminUsername: Joi.string().required(),
    adminPassword: Joi.string().required(),
  });
  return schema.validate(data);
};

const validateUpdateRestaurant = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    address: Joi.string(),
    picture: Joi.string(),
    adminUsername: Joi.string(),
    adminPassword: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
}

module.exports = { validateCreateRestaurant, validateUpdateRestaurant, loginValidator };
