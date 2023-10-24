import express from 'express'

import * as adminController from '../controllers/admin.js'

import isAdmin from '../middlewares/isAdmin.js'

import Article from '../models/Article.js'
import Campaign from '../models/campaign.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.get('/', isAdmin, wrapAsync(adminController.index))

router.get('/donatur', isAdmin, (req, res) => {
    res.render('dashboard/donatur')
})

router.get('/campaigns', isAdmin, async (req, res) => {
    const campaigns = await Campaign.find()
    res.render('dashboard/campaigns/index', { campaigns })
})

router.get('/articles', isAdmin, async (req, res) => {
    const articles = await Article.find()
    res.render('dashboard/articles/index', { articles })
})

export default router
