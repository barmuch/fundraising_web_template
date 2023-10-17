import app from './app.js'
import mongoose from 'mongoose'
import config from './configs/vars.js'

let server

// connect to mongodb
mongoose.connect(config.db_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB')
    server = app.listen(config.port, () => {
        console.log(`listening on port ${config.port}`)
    })
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed')
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    console.error(error)
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
    console.log('SIGTERM received')
    if (server) {
        server.close()
    }
})
