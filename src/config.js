const API_GATEWAY_TEST = 'http://localhost:5000'
const API_GATEWAY_RELEASE = 'http://192.168.252.121:5000'

// const API_GATEWAY_MEDIA_TEST = 'http://localhost:1234'
const API_GATEWAY_MEDIA_RELEASE = 'http://192.168.252.121:1234'

const AUTH_API = API_GATEWAY_RELEASE
const CATEGORY_API = API_GATEWAY_RELEASE
const STATION_AUTO_API = API_GATEWAY_RELEASE
const PORT_DEPLOY = 5555
const DATA_STATION_AUTO_API = API_GATEWAY_RELEASE
const MEDIA_API = API_GATEWAY_MEDIA_RELEASE

const STATION_CONTROL_API = 'http://118.69.55.217:8180'

const GOOGLE_MAP = {
  KEY: 'AIzaSyCcApeoQRqf1Fq2g7_rn1aALfEEm7nNS8U'
}
module.exports.API_GATEWAY_TEST = API_GATEWAY_TEST
module.exports.API_GATEWAY_RELEASE = API_GATEWAY_RELEASE
module.exports.AUTH_API = AUTH_API
module.exports.CATEGORY_API = CATEGORY_API
module.exports.STATION_AUTO_API = STATION_AUTO_API
module.exports.PORT_DEPLOY = PORT_DEPLOY
module.exports.GOOGLE_MAP = GOOGLE_MAP
module.exports.DATA_STATION_AUTO_API = DATA_STATION_AUTO_API
module.exports.MEDIA_API = MEDIA_API
module.exports.STATION_CONTROL_API = STATION_CONTROL_API

module.exports.default = {
  API_GATEWAY_TEST,
  API_GATEWAY_RELEASE,
  AUTH_API,
  CATEGORY_API,
  STATION_AUTO_API,
  GOOGLE_MAP,
  PORT_DEPLOY,
  DATA_STATION_AUTO_API,
  MEDIA_API,
  STATION_CONTROL_API
}
