import express from 'express'

const router = express.Router()

router.route('/').get((req, res, next) => {
    // Simulate an error
    const err = new Error('This is a simulated error.')
    next(err)
})

export default router
