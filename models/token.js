import mongoose from 'mongoose'

import tokenTypes from '../configs/tokens.js'

const Schema = mongoose.Schema

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Token', tokenSchema)
