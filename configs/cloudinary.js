import { v2 as cloudinary } from 'cloudinary'

import config from './vars.js'

cloudinary.config({
    cloud_name: config.cloudinary_CLOUD_NAME,
    api_key: config.cloudinary_API_KEY,
    api_secret: config.cloudinary_API_SECRET,
})

export default cloudinary
