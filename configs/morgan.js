import morgan from 'morgan'
import dotenv from 'dotenv'
import logger from './logger.js'

dotenv.config()
const env = process.env.NODE_ENV

morgan.token('message', (req, res) => res.locals.errorMessage || '')

const getIpFormat = () => (env === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger.info(message.trim()) },
})

const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
})

export default {
    successHandler,
    errorHandler,
}
