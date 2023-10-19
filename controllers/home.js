import Article from '../models/Article.js'
import Campaign from '../models/campaign.js'

export const index = async (req, res) => {
    const campaigns = await Campaign.find()
    const articles = await Article.find()
    res.render('home', { campaigns, articles })
}
