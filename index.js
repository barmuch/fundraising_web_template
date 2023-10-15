import app from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import logger from './configs/logger.js'
dotenv.config()

const port = process.env.PORT
const db_URI = process.env.DB_URI

let server

// connect to mongodb
mongoose.connect(db_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    logger.info('Connected to MongoDB')
    server = app.listen(port, () => {
        logger.info(`listening on port ${port}`)
    })
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
        server.close()
    }
})
