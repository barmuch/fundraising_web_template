import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

import UserVerification from '../models/userVerification.js'

import logger from '../configs/logger.js'
import config from '../configs/vars.js'

const transporter = nodemailer.createTransport(config.email.smtp)

transporter.verify((error, success) => {
    if (error) {
        logger.error(error.message)
    } else {
        logger.info('Server is ready to take messages')
    }
})

export const sendVerificationEmail = async (userId, email) => {
    const uniqueString = uuidv4() + userId.toString()

    const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click the link below to verify your email address.</p>
               <p>This link will expire in 6 hours.</p>
               <p>Click here to verify your email: <a href="${
                   config.base_URL
               }/auth/verify-email/${userId.toString()}/${uniqueString}">Verify Email</a></p>`,
    }

    // hash the uniqueString
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(uniqueString, salt)
    if (!hash) throw new Error('Error hashing uniqueString')

    // store hashed uniqueString in database
    const userVerification = new UserVerification({
        userId: userId,
        uniqueString: hash,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    })
    const saveVerification = await userVerification.save()
    if (!saveVerification) {
        throw new Error('Error saving userVerification')
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error('Error sending verification email')
        }
    })
}
