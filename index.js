import app from './app.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const port = process.env.PORT
const db_URI = process.env.DB_URI

// connect to mongodb
mongoose
    .connect(db_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database...')
    })
    .catch((error) => {
        console.error('Connection error:', error)
    })

app.listen(port, () => {
    console.log(`server is running on http://localhost:3000`)
})
