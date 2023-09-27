
import Article from "../models/Article.js";
import fs from 'fs';

const index = async (req, res) => {
    const articles = await Article.find();
    const user = req.user
    res.render('articles/index.ejs', {articles, user});
}

const create = (req, res) => {
    res.render('articles/create.ejs');
}

const store = async (req, res, next) => {
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    const article = new Article(req.body.article);   
    article.images = images;
    await article.save();

    req.flash('success_msg', 'New article Added!');
    res.redirect('/');
}


const show = async (req, res) => {
    const article = await Article.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');  
  
    res.render('articles/show', { article});
}



const edit = async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article });
}

const update = async (req, res) => {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(id, { ...req.body.article });

    if (req.files && req.files.length > 0) {
        article.images.forEach(image => {
            fs.unlinkSync(image.url);
        });

        const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        article.images = images
        await article.save();
    }

    req.flash('success_msg', 'article Updated!');
    res.redirect(`/articles/${article._id}`);
}

const destroy = async (req, res) => {
    const { id } = req.params
    const article = await Article.findById(id);

    // if (article.images.length > 0) {
    //     place.images.forEach(image => {
    //         fs.unlinkSync(image.url);
    //     });
    // }

    await Article.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'article Deleted!');
    const articles = await Article.find();
    res.render('articles/index.ejs', {articles});
}

const destroyImages = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const article = await Article.findById(id);
        if (!place) {
            req.flash('error_msg', 'Place not found');
            return res.redirect(`/places/${id}/edit`);
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image');
            return res.redirect(`/article/${id}/edit`);
        }

        // Hapus file gambar dari sistem file
        images.forEach(image => {
            fs.unlinkSync(image);
        });

        // Hapus data gambar dari model Place
        await Article.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } },
            { new: true }
        );

        req.flash('success_msg', 'Successfully deleted images');
        return res.redirect(`/articles/${id}/edit`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete images');
        return res.redirect(`/articles/${id}/edit`);
    }
}



export {
  index, create, store, show, edit, update, destroy, destroyImages, 
}