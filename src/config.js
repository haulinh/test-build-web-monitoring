const API_GATEWAY_TEST = 'http://localhost:5000'
const API_GATEWAY_RELEASE = 'http://swn.vietan-software.com:5000'

const AUTH_API = API_GATEWAY_RELEASE
const CATEGORY_API = API_GATEWAY_RELEASE
const STATION_AUTO_API = API_GATEWAY_RELEASE
const PORT_DEPLOY = 5555
const DATA_STATION_AUTO_API = API_GATEWAY_RELEASE

const GOOGLE_MAP = {
  KEY: 'AIzaSyACrFcsYEYnifIzzbIOEI6y2v0qVSi9TvU'
}
module.exports.API_GATEWAY_TEST = API_GATEWAY_TEST
module.exports.API_GATEWAY_RELEASE = API_GATEWAY_RELEASE
module.exports.AUTH_API = AUTH_API
module.exports.CATEGORY_API = CATEGORY_API
module.exports.STATION_AUTO_API = STATION_AUTO_API
module.exports.PORT_DEPLOY = PORT_DEPLOY
module.exports.GOOGLE_MAP = GOOGLE_MAP
module.exports.DATA_STATION_AUTO_API = DATA_STATION_AUTO_API

module.exports.default = {
  API_GATEWAY_TEST,
  API_GATEWAY_RELEASE,
  AUTH_API,
  CATEGORY_API,
  STATION_AUTO_API,
  GOOGLE_MAP,
  PORT_DEPLOY,
  DATA_STATION_AUTO_API
}
