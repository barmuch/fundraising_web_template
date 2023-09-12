import express from 'express'
import wrapAsync from '../utils/wrapAsync.js';
import * as PlaceController from '../controllers/places.js'
import isValidObjectId from '../middlewares/isValidObjectId.js';
import isAuth from '../middlewares/isAuth.js';
import validatePlace from '../middlewares/validatePlace.js';
import { isAuthorPlace } from '../middlewares/isAuthor.js';
import upload from '../configs/multer.js';
const router = express.Router();

router.route('/')
    .get(wrapAsync(PlaceController.index))
    .post(isAuth, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.store))

router.get('/create', isAuth, PlaceController.create)

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), upload.array('image', 5), validatePlace, wrapAsync(PlaceController.update))
    .delete(isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroy))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.edit))

router.delete('/:id/images', wrapAsync(PlaceController.destroyImages))

export default router;