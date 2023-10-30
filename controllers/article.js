import Article from '../models/Article.js'

export const index = async (req, res) => {
    const articles = await Article.find()
    const user = req.user
    res.render('articles/index.ejs', { articles, user })
}

export const show = async (req, res) => {
    const article = await Article.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author')

    res.render('articles/show', { article })
}
