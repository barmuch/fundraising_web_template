import httpStatus from 'http-status'

import User from '../models/user.js'

import ExpressError from '../utils/ExpressError.js'

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    const { email, username, password } = userBody
    const user = new User({ email, username })
    const registerUser = await User.register(user, password)
    return registerUser
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
    const users = await User.find()
    return users
}

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id)
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email })
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new ExpressError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ExpressError('Email already taken', httpStatus.BAD_REQUEST)
    }
    Object.assign(user, updateBody)
    await user.save()
    return user
}

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new ExpressError('User not found', httpStatus.NOT_FOUND)
    }
    await user.remove()
    return user
}

export { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById }
