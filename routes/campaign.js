import express from 'express'

import * as campaignController from '../controllers/campaigns.js'
import * as paymentController from '../controllers/payment.js'

import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router()

router.get('/index', wrapAsync(campaignController.index))
router.get('/:id', wrapAsync(campaignController.show))

router.route('/payment/notification').post(wrapAsync(paymentController.handleTransactionNotification))

router
    .route('/payment/:campaignId')
    .get(wrapAsync(paymentController.payment))
    .post(wrapAsync(paymentController.createTransaction))

export default router
