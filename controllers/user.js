import User from '../models/user.js'

export const getUser = async (req, res) => {
    const user = await User.find({ username: req.params.username })
    if (!user) {
        req.flash('error_msg', 'User not found')
        return res.redirect('/')
    }
    res.render('profile', { user })
}
export const getUserById = async (req, res) => {
    const id = req.params.userId
    res.status(200).send(`Find a user with id ${id} successfully`)
}
export const updateUserById = async (req, res) => {
    const id = req.params.userId
    res.status(200).send(`Update a user with id ${id} successfully`)
}
export const deleteUserById = async (req, res) => {
    const id = req.params.userId
    res.status(200).send(`Delete a user with id ${id} successfully`)
}
