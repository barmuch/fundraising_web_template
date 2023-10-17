import express from 'express'
import passport from 'passport'
import * as AuthController from '../controllers/auth.js'
import wrapAsync from '../utils/wrapAsync.js'
import validateUser from '../middlewares/validateUser.js'
const router = express.Router()

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register')
    })
    .post(validateUser, wrapAsync(AuthController.register))

router
    .route('/login')
    .get(AuthController.loginForm)
    .post(
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: {
                type: 'error_msg',
                msg: 'Invalid username or password',
            },
        }),
        AuthController.login
    )

router.post('/logout', AuthController.logout)

router.route('/auth/google').get(passport.authenticate('google'))

router.route('/redirect/google').get(
    passport.authenticate('google', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
    })
)

export default router
