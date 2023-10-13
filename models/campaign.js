import mongoose from 'mongoose'
const Schema = mongoose.Schema
import Review from './review.js'

const campaignSchema = new Schema({
    title: String,
    description: String,
    target: Number,
    images: [
        {
            url: String,
            filename: String,
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
