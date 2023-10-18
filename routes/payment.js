import express from 'express'

import * as CampaignController from '../controllers/campaigns.js'

import isAdmin from '../middlewares/isAdmin.js'
import { isAuthorPlace } from '../middlewares/isAuthor.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'
import validateCampaign from '../middlewares/validateCampaign.js'

import wrapAsync from '../utils/wrapAsync.js'

import upload from '../configs/multer.js'

const router = express.Router()

router.get('/callback')

router.route('/').post(upload.array('image', 5), validateCampaign, wrapAsync(CampaignController.store))

router.get('/create', isAdmin, CampaignController.create)

router.get('/index', CampaignController.index)

router
    .route('/:id')
    .get(isValidObjectId('/campaigns'), wrapAsync(CampaignController.show))
    .put(upload.array('image', 5), wrapAsync(CampaignController.update))
    .delete(wrapAsync(CampaignController.destroy))

router.get('/:id/edit', isAdmin, wrapAsync(CampaignController.edit))

router.delete('/:id/images', wrapAsync(CampaignController.destroyImages))

export default router
