import Campaign from '../models/campaign.js'

import * as cloudinaryService from '../services/cloudinary.service.js'

import config from '../configs/vars.js'

export const showCampaigns = async (req, res) => {
    const campaigns = await Campaign.find()
    res.render('dashboard/campaigns/index', { campaigns })
}

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
    res.redirect('/admin/campaigns')
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
    res.redirect(`/admin/campaigns/${campaign._id}`)
}

export const destroyCampaign = async (req, res) => {
    const { id } = req.params
    const campaign = await Campaign.findById(id)

    if (!campaign) {
        req.flash('error_msg', 'Campaign not found')
        return res.redirect('/admin/campaigns')
    }

    // delete image in cloudinary
    const publicIds = campaign.images.map((image) => image.public_id)
    await cloudinaryService.destroy(publicIds)

    await Campaign.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'campaign Deleted!')
    res.redirect(`/admin/campaigns`)
}

export const destroyImagesCampaign = async (req, res) => {
    const { id } = req.params
    try {
        const { images } = req.body

        const campaign = await Campaign.findById(id)
        if (!campaign) {
            req.flash('error_msg', 'campaign not found')
            return res.redirect(`/admin/campaigns/${id}`)
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image')
            return res.redirect(`/admin/campaigns/${id}`)
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
        return res.redirect(`/admin/campaigns/${id}`)
    } catch (err) {
        req.flash('error_msg', 'Failed to delete images')
        return res.redirect(`/admin/campaigns/${id}`)
    }
}
