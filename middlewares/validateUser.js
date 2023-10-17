import ExpressError from '../utils/ExpressError.js'
import { userSchema } from '../schemas/user.js'

export default (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((el) => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next()
    }
}
