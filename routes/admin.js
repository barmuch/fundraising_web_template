import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import * as CampaignController from '../controllers/campaigns.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'
import isAdmin from '../middlewares/isAdmin.js'
import validateCampaign from '../middlewares/validateCampaign.js'
import { isAuthorPlace } from '../middlewares/isAuthor.js'
import Campaign from '../models/campaign.js'
import Article from '../models/Article.js'
import upload from '../configs/multer.js'
const router = express.Router()

router.get('/', (req,res) => {
    res.render('dashboard/index') 
})

router.get('/donatur', (req,res) => {    
    res.render('dashboard/donatur') 
})

router.get('/campaigns', async (req,res) => {
    const campaigns = await Campaign.find()  
    res.render('dashboard/campaigns', { campaigns})
})

router.get('/articles', async (req,res) => {
    const articles = await Article.find()  
    res.render('dashboard/articles', { articles})
})

router.get('/index', CampaignController.index)

router
    .route('/:id')
    .get(isValidObjectId('/campaigns'), wrapAsync(CampaignController.show))
    .put(upload.array('image', 5), wrapAsync(CampaignController.update))
    .delete(wrapAsync(CampaignController.destroy))

router.get('/:id/edit', isAdmin, wrapAsync(CampaignController.edit))

router.delete('/:id/images', wrapAsync(CampaignController.destroyImages))

export default router
