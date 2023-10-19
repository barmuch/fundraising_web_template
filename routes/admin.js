import express from 'express'

import * as CampaignController from '../controllers/campaigns.js'

import isAdmin from '../middlewares/isAdmin.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'

import Article from '../models/Article.js'
import Campaign from '../models/campaign.js'

import wrapAsync from '../utils/wrapAsync.js'

import upload from '../configs/multer.js'

const router = express.Router()

router.get('/', isAdmin, (req, res) => {
    res.render('dashboard/index')
})

router.get('/donatur', isAdmin, (req, res) => {
    res.render('dashboard/donatur')
})

router.get('/campaigns', isAdmin, async (req, res) => {
    const campaigns = await Campaign.find()
    res.render('dashboard/campaigns', { campaigns })
})

router.get('/articles', isAdmin, async (req, res) => {
    const articles = await Article.find()
    res.render('dashboard/articles', { articles })
})

router.get('/index', isAdmin, CampaignController.index)

router
    .route('/:id')
    .get(isValidObjectId('/campaigns'), wrapAsync(CampaignController.show))
    .put(upload.array('image', 5), wrapAsync(CampaignController.update))
    .delete(wrapAsync(CampaignController.destroy))

router.get('/:id/edit', isAdmin, wrapAsync(CampaignController.edit))

router.delete('/:id/images', wrapAsync(CampaignController.destroyImages))

export default router
