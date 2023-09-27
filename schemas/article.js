import Joi from 'joi'

export const articleSchema = Joi.object({
    article: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        // image: Joi.string().required()
    }).required()
})
