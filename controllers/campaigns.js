import Campaign from '../models/campaign.js'

export const index = async (req, res) => {
    const campaigns = await Campaign.find()
    const user = req.user
    res.render('campaigns/index.ejs', { campaigns, user })
}

export const show = async (req, res) => {
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
