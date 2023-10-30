import express from 'express'

import * as adminController from '../controllers/admin.js'
import * as adminArticleController from '../controllers/adminArticle.js'
import * as adminCampaignController from '../controllers/adminCampaign.js'

import isAdmin from '../middlewares/isAdmin.js'
import validateArticle from '../middlewares/validateArticle.js'
import validateCampaign from '../middlewares/validateCampaign.js'

import wrapAsync from '../utils/wrapAsync.js'

import upload from '../configs/multer.js'

const router = express.Router()

router.route('/').get(isAdmin, wrapAsync(adminController.index))

router.route('/donatur').get(isAdmin, (req, res) => {
    res.render('dashboard/donatur')
})

/** Admin Article */
router.route('/articles').get(isAdmin, wrapAsync(adminArticleController.showArticle))

router
    .route('/articles/create')
    .get(isAdmin, adminArticleController.createArticle)
    .post(isAdmin, upload.array('image', 5), validateArticle, wrapAsync(adminArticleController.storeArticle))

router
    .route('/articles/:id')
    .get(isAdmin, wrapAsync(adminArticleController.editArticle))
    .put(isAdmin, upload.array('image', 5), wrapAsync(adminArticleController.updateArticle))
    .delete(isAdmin, wrapAsync(adminArticleController.destroyArticle))

router.route('/articles/:id/images').delete(isAdmin, wrapAsync(adminArticleController.destroyImagesArticle))

/** Admin Campaign */
router.route('/campaigns').get(isAdmin, wrapAsync(adminCampaignController.showCampaigns))

router
    .route('/campaigns/create')
    .get(isAdmin, adminCampaignController.createCampaign)
    .post(isAdmin, upload.array('image', 5), validateCampaign, wrapAsync(adminCampaignController.storeCampaign))

router
    .route('/campaigns/:id')
    .get(isAdmin, wrapAsync(adminCampaignController.editCampaign))
    .put(isAdmin, upload.array('image', 5), wrapAsync(adminCampaignController.updateCampaign))
    .delete(isAdmin, wrapAsync(adminCampaignController.destroyCampaign))

router.route('/campaigns/:id/images').delete(isAdmin, wrapAsync(adminCampaignController.destroyImagesCampaign))

export default router
