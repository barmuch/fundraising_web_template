import app from './app.js'
import mongoose from 'mongoose'
import config from './configs/vars.js'
import logger from './configs/logger.js'

let server

// connect to mongodb
mongoose.connect(config.db_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    logger.info('Connected to MongoDB')
    server = app.listen(config.port, () => {
        logger.info(`listening on port ${config.port}`)
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
    logger.error(error.message)
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
