
import Campaign from "../models/campaign.js";
import fs from 'fs';


const home = async (req, res) => {
    const campaigns = await Campaign.find();
    res.render('home', {campaigns});
}

const create = (req, res) => {
    res.render('places/create');
}

const store = async (req, res, next) => {
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));

    const place = new Place(req.body.place);
    place.author = req.user._id
    place.images = images;
    place.geometry = geoData

    await place.save();

    req.flash('success_msg', 'Place Created!');
    res.redirect('/places');
}


const show = async (req, res) => {
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.render('places/show', { place });
}

const edit = async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}

const update = async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });

    if (req.files && req.files.length > 0) {
        place.images.forEach(image => {
            fs.unlinkSync(image.url);
        });

        const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        place.images = images
        await place.save();
    }

    req.flash('success_msg', 'Place Updated!');
    res.redirect(`/places/${place._id}`);
}

const destroy = async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id);

    if (place.images.length > 0) {
        place.images.forEach(image => {
            fs.unlinkSync(image.url);
        });
    }

    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place Deleted!');
    res.redirect('/places');
}

const destroyImages = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const place = await Place.findById(id);
        if (!place) {
            req.flash('error_msg', 'Place not found');
            return res.redirect(`/places/${id}/edit`);
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image');
            return res.redirect(`/places/${id}/edit`);
        }

        // Hapus file gambar dari sistem file
        images.forEach(image => {
            fs.unlinkSync(image);
        });

        // Hapus data gambar dari model Place
        await Place.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } },
            { new: true }
        );

        req.flash('success_msg', 'Successfully deleted images');
        return res.redirect(`/places/${id}/edit`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete images');
        return res.redirect(`/places/${id}/edit`);
    }
}

export {
    home, create, store, show, edit, update, destroy, destroyImages
}