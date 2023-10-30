import httpStatus from 'http-status'

import Campaign from '../models/campaign.js'
import Donation from '../models/donation.js'

import * as cloudinaryService from '../services/cloudinary.service.js'
import * as emailService from '../services/email.service.js'
import * as midtransService from '../services/midtrans.service.js'

import logger from '../configs/logger.js'
import config from '../configs/vars.js'

export const createCampaign = (req, res) => {
    res.render('dashboard/campaigns/create.ejs')
}

export const storeCampaign = async (req, res, next) => {
    // upload image to cloudinary
    const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_CAMPAIGN)
    const campaign = new Campaign(req.body.campaign)
    campaign.images = images
    await campaign.save()

    req.flash('success_msg', 'New Campaign Added!')
    res.redirect('/')
}

export const editCampaign = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id)
    const user = req.user
    res.render('dashboard/campaigns/edit', { campaign, user })
}

export const updateCampaign = async (req, res) => {
    const { id } = req.params
    const campaign = await Campaign.findByIdAndUpdate(id, { ...req.body.campaign })

    if (req.files && req.files.length > 0) {
        // delete previous images
        const publicIds = campaign.images.map((image) => image.public_id)
        await cloudinaryService.destroy(publicIds)

        // upload new images
        const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_CAMPAIGN)
        campaign.images = images
        await campaign.save()
    }

    req.flash('success_msg', 'campaign Updated!')
    res.redirect(`/campaigns/${campaign._id}`)
}

export const destroyCampaign = async (req, res) => {
    const { id } = req.params
    const campaign = await Campaign.findById(id)

    if (!campaign) {
        req.flash('error_msg', 'Campaign not found')
        return res.redirect('/')
    }

    // delete image in cloudinary
    const publicIds = campaign.images.map((image) => image.public_id)
    await cloudinaryService.destroy(publicIds)

    await Campaign.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'campaign Deleted!')
    const campaigns = await Campaign.find()
    res.render('campaigns/index.ejs', { campaigns })
}

export const destroyImagesCampaign = async (req, res) => {
    const { id } = req.params
    try {
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const campaign = await Campaign.findById(id)
        if (!campaign) {
            req.flash('error_msg', 'Places not found')
            return res.redirect(`/places/${id}/edit`)
        }

        if (!images) {
            req.flash('error_msg', 'Please select at least one image')
            return res.redirect(`/campaign/${id}/edit`)
        }

        // delete image im cloudinary by public id
        await cloudinaryService.destroy(images)

        // update images in campaign
        const newImages = campaign.images.filter((image) => {
            return !images.includes(image.public_id)
        })

        campaign.images = newImages
        await campaign.save()

        req.flash('success_msg', 'Successfully deleted images')
        return res.redirect(`/campaigns/${id}/edit`)
    } catch (err) {
        req.flash('error_msg', 'Failed to delete images')
        return res.redirect(`/campaigns/${id}/edit`)
    }
}

export const payment = async (req, res) => {
    const { campaignId } = req.params
    const user = {
        username: '',
        email: '',
    }
    const currentUser = req.user
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) {
        req.flash('error_msg', 'Campaign not found')
        return res.redirect('/')
    }

    if (currentUser && currentUser._id && currentUser.username) {
        user.username = currentUser.username
        user.email = currentUser.email
    }

    res.render('campaigns/payment', { campaign, user })
}

export const createTransaction = async (req, res) => {
    const { campaignId } = req.params
    const { username, email, amount } = req.body.payment
    if (!username || !email || !amount) {
        req.flash('error_msg', 'Please fill all fields')
        return res.redirect(`/campaigns/payment/${campaignId}`)
    }

    const campaign = await Campaign.findById(campaignId)

    if (!campaign) {
        req.flash('error_msg', 'Campaign not found')
        return res.redirect('/')
    }

    function createUniqueString() {
        const currentDate = new Date()
        const uniqueString = currentDate.toISOString().replace(/[^0-9]/g, '')
        return uniqueString
    }

    const orderId = 'fundraising-' + username + '-' + createUniqueString()

    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: parseInt(amount),
        },
        item_details: [
            {
                id: campaignId,
                price: parseInt(amount),
                quantity: 1,
                name: campaign.title,
                brand: 'Ummati',
                category: 'Donations',
                merchant_name: 'Ummati',
            },
        ],
        credit_card: {
            secure: true,
        },
        customer_details: {
            first_name: username,
            email: email,
        },
    }

    // TODO: create new donation data
    const donation = new Donation({
        donorName: username, // Name of the donor
        donorEmail: email, // Email of the donor
        donationAmount: parseInt(amount), // Amount of the donation
        donationDate: new Date(), // Date of the donation
        campaign: campaignId, // Reference to th,
        orderId: orderId, // A unique identifier for the transaction from midtrans
        amount: parseInt(amount), // Amount of the transaction
        status: 'pending', // Status of the transaction default is pending
    })

    // create new donation data
    const savedDonation = await donation.save()
    if (!savedDonation) {
        req.flash('error_msg', 'Failed to create donation model')
        return res.redirect('/')
    }

    const redirectUrl = await midtransService.createTransactionRedirectUrl(parameter)
    res.redirect(redirectUrl)
}

export const handleTransactionNotification = async (req, res) => {
    // let mockNotificationJson = {
    //     transaction_time: '2023-10-20 13:59:18',
    //     transaction_status: 'capture',
    //     transaction_id: '5be22b55-cc45-4cd2-98b5-19675a95c977',
    //     three_ds_version: '2',
    //     status_message: 'midtrans payment notification',
    //     status_code: '200',
    //     signature_key:
    //         '1f1d3c382ba92310a7c085e9cb25ae7ecacb712db132cdc448d107bfb07948160eb1a4fa60ee1c7c66d822d37cf7854c7ecddf66542ef37d351bba7792da9ba0',
    //     payment_type: 'credit_card',
    //     order_id: 'fundraising-test-20231020065855524',
    //     merchant_id: 'G048089139',
    //     masked_card: '48111111-1114',
    //     gross_amount: '122222.00',
    //     fraud_status: 'accept',
    //     expiry_time: '2023-10-20 14:09:18',
    //     eci: '05',
    //     currency: 'IDR',
    //     channel_response_message: 'Approved',
    //     channel_response_code: '00',
    //     card_type: 'credit',
    //     bank: 'bni',
    //     approval_code: '1697785165108',
    // }

    const notificationJson = req.body

    const statusResponse = await midtransService.createTransactionNotification(notificationJson)

    let orderId = statusResponse.order_id
    let transactionStatus = statusResponse.transaction_status
    let fraudStatus = statusResponse.fraud_status

    // Find transaction document by order_id
    const donation = await Donation.findOne({ orderId: orderId })

    if (transactionStatus == 'capture') {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == 'challenge') {
            //TODO: set transaction status on your database to 'challenge'
            donation.status = 'challenge'
        } else if (fraudStatus == 'accept') {
            //TODO: set transaction status on your database to 'success'
            donation.status = 'success'
        }
    } else if (transactionStatus == 'settlement') {
        //TODO: set transaction status on your database to 'success'
        donation.status = 'success'
    } else if (transactionStatus == 'cancel') {
        //TODO: set transaction status on your database to 'failure'
        donation.status = 'cancel'
    } else if (transactionStatus == 'pending') {
        //TODO: set transaction status on your database to 'pending' / waiting payment
        donation.status = 'pending'
    } else if (transactionStatus == 'expire') {
        //TODO: set transaction status on your database to 'failure'
        donation.status = 'cancel'
    }

    await donation.save()

    logger.info(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    )

    //TODO: send notification email to client
    let emailMessage = 'Payment complete with status ' + donation.status
    await emailService.sendPaymentNotificationEmail(donation.donorEmail, emailMessage)

    res.status(httpStatus.NO_CONTENT).send('Transaction notification received')
}
