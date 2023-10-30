import Article from '../models/Article.js'

import * as cloudinaryService from '../services/cloudinary.service.js'

import config from '../configs/vars.js'

export const showArticle = async (req, res) => {
    const articles = await Article.find()
    res.render('dashboard/articles/index', { articles })
}

export const createArticle = (req, res) => {
    res.render('dashboard/articles/create')
}

export const storeArticle = async (req, res, next) => {
    // upload image to cloudinary
    const images = await cloudinaryService.upload(req.files, config.cloudinary_UPLOAD_PRESET_ARTICLE)
    const article = new Article(req.body.article)
    article.images = images
    await article.save()

    req.flash('success_msg', 'New article Added!')
    res.redirect('/admin/articles')
}

export const editArticle = async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('dashboard/articles/edit', { article })
}

export const updateArticle = async (req, res) => {
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
    res.redirect(`/admin/articles`)
}

export const destroyArticle = async (req, res) => {
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
    res.redirect(`/admin/articles`)
}

export const destroyImagesArticle = async (req, res) => {
    const { id } = req.params
    try {
        const { images } = req.body

        const article = await Article.findById(id)
        if (!article) {
            req.flash('error_msg', 'Articles not found')
            return res.redirect(`/admin/articles`)
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image')
            return res.redirect(`/admin/articles/${id}`)
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
        return res.redirect(`/admin/articles/${id}`)
    } catch (err) {
        req.flash('error_msg', 'Failed to delete images')
        return res.redirect(`/admin/articles/${id}`)
    }
}
