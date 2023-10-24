import express from 'express'

import * as userController from '../controllers/user.js'

import isAuth from '../middlewares/isAuth.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.route('/:username').get(isAuth, wrapAsync(userController.getUser))
router
    .route('/:userId')
    .get(wrapAsync(userController.getUserById))
    .post(wrapAsync(userController.updateUserById))
    .delete(wrapAsync(userController.deleteUserById))

export default router
