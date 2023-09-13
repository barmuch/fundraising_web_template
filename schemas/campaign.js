import Joi from 'joi'

export const campaignSchema = Joi.object({
    place: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).required(),
        // image: Joi.string().required()
    }).required()
})
