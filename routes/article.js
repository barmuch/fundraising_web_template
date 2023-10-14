import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import * as ArticleController from '../controllers/article.js'
import isValidObjectId from '../middlewares/isValidObjectId.js'
import isAdmin from '../middlewares/isAdmin.js'
import validateArticle from '../middlewares/validateArticle.js'
import upload from '../configs/multer.js'
const router = express.Router()

router.route('/').post(upload.array('image', 5), validateArticle, wrapAsync(ArticleController.store))

router.get('/create', isAdmin, ArticleController.create)

router.get('/index', ArticleController.index)

router
    .route('/:id')
    .get(isValidObjectId('/articles'), wrapAsync(ArticleController.show))
    .put(upload.array('image', 5), wrapAsync(ArticleController.update))
    .delete(wrapAsync(ArticleController.destroy))

router.get('/:id/edit', isAdmin, wrapAsync(ArticleController.edit))

router.delete('/:id/images', wrapAsync(ArticleController.destroyImages))

export default router
