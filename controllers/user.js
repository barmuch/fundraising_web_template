export const getUser = async (req, res) => {
    res.status(200).send('Find a user successfully')
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
