import express from 'express'
import passport from 'passport'

import * as pageController from '../controllers/home.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.route('/').get(wrapAsync(pageController.index))

export default router
