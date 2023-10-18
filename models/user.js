import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: { type: String },
    googleId: { type: String },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
})

userSchema.plugin(passportLocalMongoose)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
    return !!user
}

export default mongoose.model('User', userSchema)
