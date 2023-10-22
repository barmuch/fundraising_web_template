import MidtransClient from 'midtrans-client'

import config from '../configs/vars.js'

// Create Snap API instance
let snap = new MidtransClient.Snap({
    isProduction: config.midtrans.isProduction,
    serverKey: config.midtrans.serverKey,
    clientKey: config.midtrans.clientKey,
})

// let parameter = {
//     transaction_details: {
//         order_id: 'test-transaction-1234',
//         gross_amount: 10000,
//     },
//     item_details: [
//         {
//             id: 'ITEM1',
//             price: 10000,
//             quantity: 1,
//             name: 'Midtrans Bear',
//             brand: 'Midtrans',
//             category: 'Toys',
//             merchant_name: 'Midtrans',
//         },
//     ],
//     customer_details: {
//         first_name: 'John',
//         last_name: 'Watson',
//         email: 'test@example.com',
//         phone: '+628123456',
//         billing_address: {
//             first_name: 'John',
//             last_name: 'Watson',
//             email: 'test@example.com',
//             phone: '081 2233 44-55',
//             address: 'Sudirman',
//             city: 'Jakarta',
//             postal_code: '12190',
//             country_code: 'IDN',
//         },
//         shipping_address: {
//             first_name: 'John',
//             last_name: 'Watson',
//             email: 'test@example.com',
//             phone: '0 8128-75 7-9338',
//             address: 'Sudirman',
//             city: 'Jakarta',
//             postal_code: '12190',
//             country_code: 'IDN',
//         },
//     },
//     enabled_payments: [
//         'credit_card',
//         'mandiri_clickpay',
//         'cimb_clicks',
//         'bca_klikbca',
//         'bca_klikpay',
//         'bri_epay',
//         'echannel',
//         'indosat_dompetku',
//         'mandiri_ecash',
//         'permata_va',
//         'bca_va',
//         'bni_va',
//         'other_va',
//         'gopay',
//         'kioson',
//         'indomaret',
//         'gci',
//         'danamon_online',
//     ],
//     credit_card: {
//         secure: true,
//         bank: 'bca',
//         installment: {
//             required: false,
//             terms: {
//                 bni: [3, 6, 12],
//                 mandiri: [3, 6, 12],
//                 cimb: [3],
//                 bca: [3, 6, 12],
//                 offline: [6, 12],
//             },
//         },
//         whitelist_bins: ['48111111', '41111111'],
//     },
//     bca_va: {
//         va_number: '12345678911',
//         free_text: {
//             inquiry: [
//                 {
//                     en: 'text in English',
//                     id: 'text in Bahasa Indonesia',
//                 },
//             ],
//             payment: [
//                 {
//                     en: 'text in English',
//                     id: 'text in Bahasa Indonesia',
//                 },
//             ],
//         },
//     },
//     bni_va: {
//         va_number: '12345678',
//     },
//     permata_va: {
//         va_number: '1234567890',
//         recipient_name: 'SUDARSONO',
//     },
//     callbacks: {
//         finish: 'https://demo.midtrans.com',
//     },
//     expiry: {
//         start_time: '2025-12-20 18:11:08 +0700',
//         unit: 'minute',
//         duration: 9000,
//     },
//     custom_field1: 'custom field 1 content',
//     custom_field2: 'custom field 2 content',
//     custom_field3: 'custom field 3 content',
// }

export const createTransactionRedirectUrl = async (parameter) => {
    let transaction = await snap.createTransaction(parameter)
    if (!transaction) {
        throw new Error('Failed to create transaction')
    }
    let redirectUrl = transaction.redirect_url

    return redirectUrl
}

// alternative way to create redirectUrl
// snap.createTransactionRedirectUrl(parameter)
//     .then((redirectUrl)=>{
//         console.log('redirectUrl:',redirectUrl);
//     })

export const createTransactionNotification = async (notificationJson) => {
    return await snap.transaction.notification(notificationJson)

    // .then((statusResponse) => {
    //     // let orderId = statusResponse.order_id
    //     // let transactionStatus = statusResponse.transaction_status
    //     // let fraudStatus = statusResponse.fraud_status
    //     // console.log(
    //     //     `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    //     // )
    //     // // Sample transactionStatus handling logic
    //     // if (transactionStatus == 'capture') {
    //     //     // capture only applies to card transaction, which you need to check for the fraudStatus
    //     //     if (fraudStatus == 'challenge') {
    //     //         // TODO set transaction status on your databaase to 'challenge'
    //     //     } else if (fraudStatus == 'accept') {
    //     //         // TODO set transaction status on your databaase to 'success'
    //     //     }
    //     // } else if (transactionStatus == 'settlement') {
    //     //     // TODO set transaction status on your databaase to 'success'
    //     // } else if (transactionStatus == 'deny') {
    //     //     // TODO you can ignore 'deny', because most of the time it allows payment retries
    //     //     // and later can become success
    //     // } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
    //     //     // TODO set transaction status on your databaase to 'failure'
    //     // } else if (transactionStatus == 'pending') {
    //     //     // TODO set transaction status on your databaase to 'pending' / waiting payment
    //     // }
    // })
}
