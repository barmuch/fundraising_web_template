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

export { registerForm, register, loginForm, login, google, logout }
