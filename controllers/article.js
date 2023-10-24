import Article from '../models/Article.js'

import * as cloudinaryService from '../services/cloudinary.service.js'

import config from '../configs/vars.js'

const index = async (req, res) => {
    const articles = await Article.find()
    const user = req.user
    res.render('articles/index.ejs', { articles, user })
}

const create = (req, res) => {
    res.render('dashboard/articles/create.ejs')
}

const store = async (req, res, next) => {
    // upload image to cloudinary
    const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_ARTICLE)
    const article = new Article(req.body.article)
    article.images = images
    await article.save()

    req.flash('success_msg', 'New article Added!')
    res.redirect('/')
}

const show = async (req, res) => {
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

const edit = async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('dashboard/articles/edit', { article })
}

const update = async (req, res) => {
    const { id } = req.params
    const article = await Article.findByIdAndUpdate(id, { ...req.body.article })

    if (req.files && req.files.length > 0) {
        // delete previous images
        const publicIds = article.images.map((image) => image.public_id)
        await cloudinaryService.destroy(publicIds)

        // upload new images
        const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_ARTICLE)
        article.images = images
        await article.save()
    }

    req.flash('success_msg', 'article Updated!')
    res.redirect(`/articles/${article._id}`)
}

const destroy = async (req, res) => {
    const { id } = req.params
    const article = await Article.findById(id)

    if (!article) {
        req.flash('error_msg', 'Article not found')
        return res.redirect('/')
    }

    // delete image in cloudinary
    const publicIds = article.images.map((image) => image.public_id)
    await cloudinaryService.destroy(publicIds)

    await Article.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'article Deleted!')
    const articles = await Article.find()
    res.render('articles/index.ejs', { articles })
}

const destroyImages = async (req, res) => {
    const { id } = req.params
    try {
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const article = await Article.findById(id)
        if (!article) {
            req.flash('error_msg', 'Place not found')
            return res.redirect(`/places/${id}/edit`)
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image')
            return res.redirect(`/article/${id}/edit`)
        }

        // delete image im cloudinary by public id
        await cloudinaryService.destroy(images)

        // update images in article
        const newImages = article.images.filter((image) => {
            return !images.includes(image.public_id)
        })

        article.images = newImages
        await article.save()
        req.flash('success_msg', 'Successfully deleted images')
        return res.redirect(`/articles/${id}/edit`)
    } catch (err) {
        req.flash('error_msg', 'Failed to delete images')
        return res.redirect(`/articles/${id}/edit`)
    }
}

export { index, create, store, show, edit, update, destroy, destroyImages }
