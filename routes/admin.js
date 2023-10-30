import express from 'express'

import * as adminController from '../controllers/admin.js'
import * as AdminArticleController from '../controllers/adminArticle.js'

import isAdmin from '../middlewares/isAdmin.js'
import validateArticle from '../middlewares/validateArticle.js'

import Campaign from '../models/campaign.js'

import wrapAsync from '../utils/wrapAsync.js'

import upload from '../configs/multer.js'

const router = express.Router()

router.get('/', wrapAsync(adminController.index))

router.get('/donatur', (req, res) => {
    res.render('dashboard/donatur')
})

router.route('/campaigns').get(async (req, res) => {
    const campaigns = await Campaign.find()
    res.render('dashboard/campaigns/index', { campaigns })
})

/** Admin Article */
router.route('/articles').get(wrapAsync(AdminArticleController.showArticle))

router
    .route('/articles/create')
    .get(AdminArticleController.createArticle)
    .post(upload.array('image', 5), validateArticle, wrapAsync(AdminArticleController.storeArticle))

router
    .route('/articles/:id')
    .get(wrapAsync(AdminArticleController.editArticle))
    .put(upload.array('image', 5), wrapAsync(AdminArticleController.updateArticle))
    .delete(wrapAsync(AdminArticleController.destroyArticle))

router.delete('/articles/:id/images', wrapAsync(AdminArticleController.destroyImagesArticle))

export default router
