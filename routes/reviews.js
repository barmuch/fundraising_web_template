import express from 'express'
import wrapAsync from '../utils/wrapAsync.js';
import Place from '../models/campaign.js';
import Review from '../models/review.js';
import * as ReviewController from '../controllers/reviews.js';
import isValidObjectId from '../middlewares/isValidObjectId.js';
import isAuth from '../middlewares/isAuth.js';
import validateReview from '../middlewares/validateReview.js';
import { isAuthorReview } from '../middlewares/isAuthor.js';
const router = express.Router({ mergeParams: true });

router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync(ReviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy))

export default router;