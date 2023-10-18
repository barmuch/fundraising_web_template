import ejsMate from 'ejs-mate'
import express from 'express'
import session from 'express-session'
import httpStatus from 'http-status'
import flash from 'connect-flash'
import methodOverride from 'method-override'
import path from 'path'
import passport from 'passport'
import { fileURLToPath } from 'url'
import config from './configs/vars.js'
import { successHandler, errorHandler } from './configs/morgan.js'
import routes from './routes/index.js'
import ExpressError from './utils/ExpressError.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(successHandler)
app.use(errorHandler)

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({
        secret: config.session_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

import './configs/passport.js'

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.currentPage = req.path
    next()
})

// view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// places routes
app.use(routes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', httpStatus.NOT_FOUND))
})

// Error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.locals.errorMessage = err.message

    const error = {}
    error.message = err.message

    if (config.env === 'development') error.stack = err.stack

    res.status(statusCode).render('error', { error })
})

export default app
