import mongoose from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: { type: String },
    googleId: { type: String },
})

userSchema.plugin(passportLocalMongoose)

export default mongoose.model('User', userSchema)
