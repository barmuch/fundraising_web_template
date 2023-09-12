import express from'express';
const router = express.Router();
// import User from'../models/user.js';
import * as AuthController from'../controllers/auth.js';
import wrapAsync from'../utils/wrapAsync.js';
import passport from'passport';

router.route('/register')
    .get((req, res) => {
        res.render('auth/register');
    })
    .post(wrapAsync(AuthController.register))

router.route('/login')
    .get(AuthController.loginForm)
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: {
            type: 'error_msg',
            msg: 'Invalid username or password'
        }
    }), AuthController.login)

router.post('/logout', AuthController.logout)


export default router;