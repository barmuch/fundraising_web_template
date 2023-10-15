import mongoose from 'mongoose'
import httpStatus from 'http-status'
import dotenv from 'dotenv'
import logger from '../configs/logger.js'
import ExpressError from '../utils/ExpressError.js'

dotenv.config()

const env = process.env.NODE_ENV

export const errorConverter = (err, req, res, next) => {
    let error = err
    if (!(error instanceof ExpressError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR
        const message = error.message || httpStatus[statusCode]
        error = new ExpressError(statusCode, message, false, err.stack)
    }
    next(error)
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err
    if (env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }

    res.locals.errorMessage = err.message

    const response = {
        code: statusCode,
        message,
        ...(env === 'development' && { stack: err.stack }),
    }

    if (env === 'development') {
        logger.error(err)
    }

    res.status(statusCode).send(response)
}
