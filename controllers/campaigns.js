import Campaign from '../models/campaign.js'
import User from '../models/user.js'
import * as cloudinaryService from '../services/cloudinary.js'
import config from '../configs/vars.js'

const index = async (req, res) => {
    const campaigns = await Campaign.find()
    const user = req.user
    res.render('campaigns/index.ejs', { campaigns, user })
}

const create = (req, res) => {
    res.render('campaigns/create.ejs')
}

const store = async (req, res, next) => {
    // upload image to cloudinary
    const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_CAMPAIGN)
    const campaign = new Campaign(req.body.campaign)
    campaign.images = images
    await campaign.save()

    req.flash('success_msg', 'New Campaign Added!')
    res.redirect('/')
}

const show = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author')

    res.render('campaigns/show', { campaign })
}

const edit = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id)
    const user = req.user
    res.render('campaigns/edit', { campaign, user })
}

const update = async (req, res) => {
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

const destroy = async (req, res) => {
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

const destroyImages = async (req, res) => {
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

export { index, create, store, show, edit, update, destroy, destroyImages }
