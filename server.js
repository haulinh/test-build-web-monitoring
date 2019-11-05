require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

var app = express()

app.get('/app.json', function(req, res) {
  res.json({
    apiGateway: process.env.WEB_GATEWAY_API || 'http://35.198.238.95:5000', //http://27.74.251.0:5000
    apiMedia: process.env.WEB_MEDIA_API || 'http://171.244.21.99:5000',
    apiCamera: process.env.WEB_CAMERA_API || 'http://171.244.21.99:5000',
    googleMapKey: process.env.GOOGLE_MAP_KEY || 'AIzaSyB8Lw-LWcdPxtz01j99UE44V9QUFw9vEO4',
    camera: {
      host: process.env.CAMERA_HOST,
      username: process.env.CAMERA_USERNAME,
      password: process.env.CAMERA_PASSWORD
    },
    firebase: {
      id: process.env.FIREBASE_ID,
      key: process.env.FIREBASE_KEY
    },
    isAdvanced: process.env.isAdvanced,
    defaultPage: process.env.DEFAULT_PAGE || '/',
    NODE_ENV: 'production'
  })
})  
app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, ''))

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const PORT = process.env.PORT || 5555
app.listen(PORT, () => {
  console.log('App listen on ' + PORT)
})
