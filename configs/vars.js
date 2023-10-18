import dotenv from 'dotenv'

dotenv.config()

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    base_URL: process.env.BASE_URL,
    db_URI: process.env.DB_URI,
    session_SECRET: process.env.SESSION_SECRET,
    cloudinary_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_API_KEY: process.env.CLOUDINARY_API_KEY,
    cloudinary_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    cloudinary_UPLOAD_PRESET_CAMPAIGN: process.env.CLOUDINARY_UPLOAD_PRESET_CAMPAIGN,
    cloudinary_UPLOAD_PRESET_ARTICLE: process.env.CLOUDINARY_UPLOAD_PRESET_ARTICLE,
    google_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    google_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
}
