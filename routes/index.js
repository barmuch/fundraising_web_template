import express from 'express'

import config from '../configs/vars.js'
import adminRoute from './admin.js'
import articleRoute from './article.js'
import authRoute from './auth.js'
import campaignRote from './campaign.js'
import contactRoute from './contact.js'
import errorRoute from './error.js'
import homeRoute from './home.js'
import userRoute from './user.js'

const router = express.Router()

const defaultRoutes = [
    {
        path: '/',
        route: homeRoute,
    },
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/campaigns',
        route: campaignRote,
    },
    {
        path: '/articles',
        route: articleRoute,
    },
    {
        path: '/contact',
        route: contactRoute,
    },
    {
        path: '/admin',
        route: adminRoute,
    },
]

const devRoutes = [
    // routes available only in development mode
    {
        path: '/error',
        route: errorRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route)
    })
}

export default router
