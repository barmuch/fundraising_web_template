import mongoose from 'mongoose'

import Review from './review.js'

const Schema = mongoose.Schema

const campaignSchema = new Schema({
    title: String,
    description: String,
    target: Number,
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

campaignSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        })
    }
})

export default mongoose.model('Campaign', campaignSchema)
