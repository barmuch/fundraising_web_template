import express from 'express'

import * as ReviewController from '../controllers/reviews.js'

import isAuth from '../middlewares/isAdmin.js'
import { isAuthorReview } from '../middlewares/isAuthor.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'
import validateReview from '../middlewares/validateReview.js'

import Place from '../models/campaign.js'
import Review from '../models/review.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router({ mergeParams: true })

router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync(ReviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy))

export default router
