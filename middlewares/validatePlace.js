
import  {placeSchema} from '../schemas/place.js';
import ExpressError from '../utils/ExpressError.js';

export default (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
}