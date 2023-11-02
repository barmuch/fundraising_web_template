import express from 'express'

import * as ArticleController from '../controllers/article.js'

const router = express.Router()

router.get('/index', ArticleController.index)
router.get('/:id', ArticleController.show)

export default router
