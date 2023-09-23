
import Campaign from "../models/campaign.js";
import fs from 'fs';


const home = async (req, res) => {
    const campaigns = await Campaign.find();
    res.render('home.ejs', {campaigns});
}

const index = async (req, res) => {
    const campaigns = await Campaign.find();
    res.render('campaigns/index.ejs', {campaigns});
}

const create = (req, res) => {
    res.render('campaigns/create.ejs');
}

const store = async (req, res, next) => {
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    const campaign = new Campaign(req.body.campaign);   
    campaign.images = images;
    await campaign.save();

    req.flash('success_msg', 'New Campaign Added!');
    res.redirect('/');
}


const show = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.render('campaigns/show', { campaign });
}

const edit = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);
    res.render('campaigns/edit', { campaign });
}

const update = async (req, res) => {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndUpdate(id, { ...req.body.campaign });

    if (req.files && req.files.length > 0) {
        campaign.images.forEach(image => {
            fs.unlinkSync(image.url);
        });

        const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        campaign.images = images
        await campaign.save();
    }

    req.flash('success_msg', 'campaign Updated!');
    res.redirect(`/campaigns/${campaign._id}`);
}

const destroy = async (req, res) => {
    const { id } = req.params
    const campaign = await Campaign.findById(id);

    // if (campaign.images.length > 0) {
    //     place.images.forEach(image => {
    //         fs.unlinkSync(image.url);
    //     });
    // }

    await Campaign.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'campaign Deleted!');
    const campaigns = await Campaign.find();
    res.render('campaigns/index.ejs', {campaigns});
}

const destroyImages = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const campaign = await Campaign.findById(id);
        if (!place) {
            req.flash('error_msg', 'Place not found');
            return res.redirect(`/places/${id}/edit`);
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image');
            return res.redirect(`/campaign/${id}/edit`);
        }

        // Hapus file gambar dari sistem file
        images.forEach(image => {
            fs.unlinkSync(image);
        });

        // Hapus data gambar dari model Place
        await Campaign.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } },
            { new: true }
        );

        req.flash('success_msg', 'Successfully deleted images');
        return res.redirect(`/campaigns/${id}/edit`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete images');
        return res.redirect(`/campaigns/${id}/edit`);
    }
}

const getDescriptionData = async (req, res) => {
    try {
        const campaignId = req.params.id;
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign tidak ditemukan' });
        }

        const deskripsi = campaign.description;
        return res.json({ deskripsi }); // Mengirimkan deskripsi sebagai respons
    } catch (error) {
        console.error(error); // Cetak error ke konsol
        return res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil deskripsi kampanye' });
    }
}

export {
    home, index, create, store, show, edit, update, destroy, destroyImages, getDescriptionData
}