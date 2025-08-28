const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        lat: Joi.number().optional().allow(null).messages({
            'number.base': 'Latitude must be a valid number'
        }),
        lng: Joi.number().optional().allow(null).messages({
            'number.base': 'Longitude must be a valid number'
        })
    }).required()
}).options({ convert: true });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        Comment: Joi.string().required()
    }).required()
});
