import express from 'express'
import passport from 'passport'

import * as AuthController from '../controllers/auth.js'

import validateUser from '../middlewares/validateUser.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.route('/register').get(AuthController.registerForm).post(validateUser, wrapAsync(AuthController.register))

router
    .route('/login')
    .get(AuthController.loginForm)
    .post(
        passport.authenticate('local', {
            failureRedirect: '/auth/login',
            failureFlash: {
                type: 'error_msg',
                msg: 'Invalid username or password',
            },
        }),
        wrapAsync(AuthController.login)
    )

router.post('/logout', wrapAsync(AuthController.logout))

router.route('/google').get(passport.authenticate('google'))

router.route('/redirect/google').get(
    passport.authenticate('google', {
        failureRedirect: '/auth/login',
        failureFlash: {
            type: 'error_msg',
            msg: 'Google login failed',
        },
    }),
    wrapAsync(AuthController.google)
)

router.route('/forgot-password').post(wrapAsync(AuthController.forgotPassword))
router.route('/reset-password').post(wrapAsync(AuthController.resetPassword))
router.route('/send-verification-email').post(wrapAsync(AuthController.sendVerificationEmail))
router.route('/verify-email').post(wrapAsync(AuthController.verifyEmail))

export default router
