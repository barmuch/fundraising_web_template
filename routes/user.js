import express from 'express'

import * as userController from '../controllers/user.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.route('/').get(wrapAsync(userController.getUser))
router
    .patch('/:userId')
    .get(wrapAsync(userController.getUserById))
    .post(wrapAsync(userController.updateUserById))
    .delete(wrapAsync(userController.deleteUserById))

export default router
