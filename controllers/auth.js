import httpStatus from 'http-status'

import User from '../models/user.js'

const registerForm = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    res.render('auth/register')
}

const register = async (req, res, next) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registerUser = await User.register(user, password)
    req.login(registerUser, (err) => {
        if (err) return next(err)

        req.flash('success_msg', 'You are now registered and logged in')
        res.redirect('/')
    })
}

const loginForm = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    res.render('auth/login')
}

const login = async (req, res) => {
    req.flash('success_msg', 'You are now logged in')
    res.redirect('/')
}

const google = async (req, res) => {
    req.flash('success_msg', 'You are now logged in')
    res.redirect('/')
}

const logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success_msg', 'You are now logged out')
        res.redirect('/')
    })
}

const forgotPassword = async (req, res) => {
    // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email)
    // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
    res.status(httpStatus.NO_CONTENT).send()
}

const resetPassword = async (req, res) => {
    // await authService.resetPassword(req.query.token, req.body.password)
    res.status(httpStatus.NO_CONTENT).send()
}

const sendVerificationEmail = async (req, res) => {
    // const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user)
    // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken)
    res.status(httpStatus.NO_CONTENT).send()
}

const verifyEmail = async (req, res) => {
    // await authService.verifyEmail(req.query.token)
    res.status(httpStatus.NO_CONTENT).send()
}

export {
    registerForm,
    register,
    loginForm,
    login,
    google,
    logout,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
}
