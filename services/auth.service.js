import httpStatus from 'http-status'

import Token from '../models/token.js'

import ExpressError from '../utils/ExpressError.js'

import tokenTypes from '../configs/tokens.js'
import * as tokenService from './token.service.js'
import * as userService from './user.service.js'

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })
    if (!refreshTokenDoc) {
        throw new ExpressError('Refresh Token Not found', httpStatus.NOT_FOUND)
    }
    await refreshTokenDoc.deleteOne()
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH)
        const user = await userService.getUserById(refreshTokenDoc.user)
        if (!user) {
            throw new Error()
        }
        await refreshTokenDoc.remove()
        return tokenService.generateAuthTokens(user)
    } catch (error) {
        throw new ExpressError('Please authenticate', httpStatus.UNAUTHORIZED)
    }
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
        const user = await userService.getUserById(resetPasswordTokenDoc.user)
        if (!user) {
            throw new Error()
        }
        await userService.updateUserById(user.id, { password: newPassword })
        await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
    } catch (error) {
        throw new ExpressError('Password reset failed', httpStatus.UNAUTHORIZED)
    }
}

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
        const user = await userService.getUserById(verifyEmailTokenDoc.user)
        if (!user) {
            throw new Error()
        }
        await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
        await userService.updateUserById(user.id, { isEmailVerified: true })
    } catch (error) {
        throw new ExpressError('Email verification failed', httpStatus.UNAUTHORIZED)
    }
}

export { logout, refreshAuth, resetPassword, verifyEmail }
