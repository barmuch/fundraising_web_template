import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userVerificationSchema = new Schema({
    userId: String,
    uniqueString: {
        type: String,
        unique: true,
    },
    createdAt: Date,
    expiresAt: Date,
})

export default mongoose.model('UserVerification', userVerificationSchema)
