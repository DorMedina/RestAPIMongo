const Joi = require('Joi');

function validateCard(card) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    description: Joi.string().max(100).required(),
    image: Joi.string().empty(''),
    phone: Joi.string().min(9).max(14).required(),
    address: Joi.string().min(10).max(50).required(),
  });

  return schema.validate(card);
}

module.exports = validateCard;
