import mongoose from 'mongoose'

import Review from './review.js'

const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: String,
    description: String,
    images: [
        {
            url: String,
            filename: String,
            public_id: String,
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
})

articleSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        })
    }
})

export default mongoose.model('Article', articleSchema)
