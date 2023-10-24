import mongoose from 'mongoose'

const Schema = mongoose.Schema

const donationSchema = new Schema({
    donorName: String, // Name of the donor
    donorEmail: String, // Email of the donor
    donationDate: Date, // Date of the donation
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
    }, // Reference to the campaign to which the donation is related
    orderId: String, // A unique identifier for the transaction from midtrans
    amount: Number, // Amount of the transaction
    status: {
        type: String,
        enum: ['success', 'cancel', 'pending', 'challenge'],
        default: 'pending',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Donation', donationSchema)
