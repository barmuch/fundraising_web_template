import express from 'express'
import wrapAsync from '../utils/wrapAsync.js';
import * as CampaignController from '../controllers/campaigns.js'
import isValidObjectId from '../middlewares/isValidObjectId.js';
import isAuth from '../middlewares/isAuth.js';
import validateCampaign from '../middlewares/validateCampaign.js';
import { isAuthorPlace } from '../middlewares/isAuthor.js';
import upload from '../configs/multer.js';
const router = express.Router();


router.route('/')
    .get(wrapAsync(CampaignController.home))
    .post( upload.array('image', 5), validateCampaign, wrapAsync(CampaignController.store))

router.get('/create', CampaignController.create)

router.get('/index', CampaignController.index)

router.route('/:id')
    .get(isValidObjectId('/campaigns'), wrapAsync(CampaignController.show))
    .put(upload.array('image', 5), wrapAsync(CampaignController.update))
    .delete(wrapAsync(CampaignController.destroy))

router.get('/:id/edit', wrapAsync(CampaignController.edit))

router.delete('/:id/images', wrapAsync(CampaignController.destroyImages))

export default router;