import * as donationService from '../services/donation.service.js'

import formatToIndonesianCurrency from '../helpers/formatToIndonesianCurrency.js'

export const index = async (req, res) => {
    // TODO: get all donations
    let donations = await donationService.getAllDonations()

    const totalAmountDonations = donations
        .filter((donation) => donation.status === 'success')
        .reduce((total, donation) => total + donation.amount, 0)

    const totalThisMonthDonationsAmount = donations
        .filter((donation) => donation.status === 'success')
        .reduce((total, donation) => {
            const donationDate = new Date(donation.donationDate)
            if (donationDate.getMonth() === new Date().getMonth()) {
                return total + donation.amount
            }
        }, 0)

    const totalThisYearDonationsAmount = donations
        .filter((donation) => donation.status === 'success')
        .reduce((total, donation) => {
            const donationDate = new Date(donation.donationDate)
            if (donationDate.getFullYear() === new Date().getFullYear()) {
                return total + donation.amount
            }
        }, 0)

    const data = {
        donations,
        total: formatToIndonesianCurrency(totalAmountDonations),
        totalThisMonthDonationsAmount: formatToIndonesianCurrency(totalThisMonthDonationsAmount),
        totalThisYearDonationsAmount: formatToIndonesianCurrency(totalThisYearDonationsAmount),
    }

    res.render('dashboard/index', { data })
}
