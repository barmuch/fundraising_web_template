const axios = require('axios')
const base64 = require('base-64')

const apiUrl = 'https://your-api-endpoint.com'
const secretKey = 'your-secret-key'

// Data to send in the POST request as x-www-form-urlencoded
const postData = {
    attribute: 'value1',
    attribute2: 'value2',
    attribute3: 'value3',
}

// Create a Basic Authentication header with the secret key
const authHeader = {
    Authorization: 'Basic ' + base64.encode(secretKey + ':'),
    'Content-Type': 'application/x-www-form-urlencoded',
}

// Convert the data object to a query string
const postBody = Object.keys(postData)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]))
    .join('&')

// Send the POST request with Basic Authentication and x-www-form-urlencoded data
axios
    .post(apiUrl, postBody, { headers: authHeader })
    .then((response) => {
        console.log('Response:', response.data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })
