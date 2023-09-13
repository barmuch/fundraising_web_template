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
    .post(isAuth, upload.array('image', 5), validateCampaign, wrapAsync(CampaignController.store))

router.get('/create', isAuth, CampaignController.create)

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(CampaignController.show))
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), upload.array('image', 5), validateCampaign, wrapAsync(CampaignController.update))
    .delete(isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(CampaignController.destroy))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(CampaignController.edit))

router.delete('/:id/images', wrapAsync(CampaignController.destroyImages))

export default router;