import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'

import User from '../models/user.js'
import UserVerification from '../models/userVerification.js'

import * as emailService from '../services/email.service.js'

import config from '../configs/vars.js'

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

const sendVerificationEmail = async (req, res, next) => {
    const userId = req.user._id
    const email = req.user.email

    if (req.user.isEmailVerified) {
        req.flash('success_msg', 'Email already verified')
        return res.redirect('/')
    }

    await emailService.sendVerificationEmail(userId, email)

    req.flash('success_msg', 'Email verification sent, please check your email')
    res.redirect('/')
}

const verifyEmail = async (req, res, next) => {
    const userId = req.params.userId
    const uniqueString = req.params.uniqueString

    // check if userVerification exists
    const userVerification = await UserVerification.findOne({ userId })
    if (!userVerification) {
        req.flash('error_msg', 'Invalid verification link')
        return res.redirect('/')
    }

    // check for expired uniqueString
    if (userVerification.expiresAt < new Date()) {
        await UserVerification.deleteOne({ _id: userVerification._id })
        req.flash('error_msg', 'Verification link has expired')
        return res.redirect('/')
    }

    // check if uniqueString matches
    const isMatch = bcrypt.compareSync(uniqueString, userVerification.uniqueString)
    if (!isMatch) {
        req.flash('error_msg', 'Invalid verification link, unique string not match')
        return res.redirect('/')
    }

    // update user field
    await User.updateOne({ _id: userId }, { isEmailVerified: true })
    await UserVerification.deleteOne({ _id: userVerification._id })

    req.flash('success_msg', 'Email verified')

    res.redirect('/')
}

export { registerForm, register, loginForm, login, google, logout, sendVerificationEmail, verifyEmail }
