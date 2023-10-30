import express from 'express'

import * as campaignController from '../controllers/campaigns.js'

import isAdmin from '../middlewares/isAdmin.js'
import { isAuthorPlace } from '../middlewares/isAuthor.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'
import validateCampaign from '../middlewares/validateCampaign.js'

import wrapAsync from '../utils/wrapAsync.js'

import upload from '../configs/multer.js'

const router = express.Router()

router.get('/index', wrapAsync(campaignController.index))
router.get('/:id', wrapAsync(campaignController.show))

// router.route('/').post(upload.array('image', 5), validateCampaign, wrapAsync(campaignController.store))

// router.get('/create', isAdmin, campaignController.create)

// router
//     .route('/:id')
//     .get(isValidObjectId('/campaigns'), wrapAsync(campaignController.show))
//     .put(upload.array('image', 5), wrapAsync(campaignController.update))
//     .delete(wrapAsync(campaignController.destroy))

// router.get('/:id/edit', isAdmin, wrapAsync(campaignController.edit))

// router.delete('/:id/images', wrapAsync(campaignController.destroyImages))

// router.route('/payment/notification').post(wrapAsync(campaignController.handleTransactionNotification))

// router
//     .route('/payment/:campaignId')
//     .get(wrapAsync(campaignController.payment))
//     .post(wrapAsync(campaignController.createTransaction))

export default router
