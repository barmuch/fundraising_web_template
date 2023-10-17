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

//module
import ExpressError from './utils/ExpressError.js'
import wrapAsync from './utils/wrapAsync.js'
import Campaign from './models/campaign.js'
import Article from './models/Article.js'
import routerUser from './routes/user.js'
import routerCampaign from './routes/campaign.js'
import routerPayment from './routes/payment.js'
import routerArticle from './routes/article.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

app.get(
    '/',
    wrapAsync(async (req, res) => {
        const campaigns = await Campaign.find()
        const articles = await Article.find()
        console.log(req.user)
        res.render('home', { campaigns, articles })
    })
)

app.get('/contact', (req, res) => {
    res.render('contact')
})

// places routes
app.use('/', routerUser)
app.use('/campaigns', routerCampaign)
app.use('/articles', routerArticle)
app.use('/payment', routerPayment)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', httpStatus.NOT_FOUND))
})

app.use((err, req, res, next) => {
    if (err) {
        console.log(err)
    }
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

export default app
