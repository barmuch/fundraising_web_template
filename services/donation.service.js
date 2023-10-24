import Donation from '../models/donation.js'

export const getAllDonations = async () => {
    const donations = await Donation.find().populate('campaign')
    return donations
}
export const getDonationById = async (id) => {
    const donation = await Donation.findById(id)
    return donation
}

export const getDonationByCampaignId = async (campaignId) => {
    const donations = await Donation.find({ campaign: campaignId })
    return donations
}
