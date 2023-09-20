import Joi from 'joi'

export const campaignSchema = Joi.object({
    campaign: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        target: Joi.number().min(0).required(),
        // image: Joi.string().required()
    }).required()
})
