import { campaignSchema } from '../schemas/campaign.js'
import ExpressError from '../utils/ExpressError.js'

export default (req, res, next) => {
    const { error } = campaignSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((el) => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next()
    }
}
