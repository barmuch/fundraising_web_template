export default class ExpressError extends Error {
    constructor(message, statusCode, isOperational = true, stack = '') {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
