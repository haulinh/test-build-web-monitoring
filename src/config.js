/* eslint-disable */
const API_GATEWAY_TEST = 'http://localhost:5009'
const API_GATEWAY_RELEASE = 'http://api.ilotusland.vn'

const API_GATEWAY_MEDIA_TEST = 'http://localhost:1234'
const API_GATEWAY_MEDIA_RELEASE = 'http://media.ilotusland.vn'

const AUTH_API = API_GATEWAY_RELEASE
const CATEGORY_API = API_GATEWAY_RELEASE
const STATION_AUTO_API = API_GATEWAY_RELEASE
const PORT_DEPLOY = 5555
const DATA_STATION_AUTO_API = API_GATEWAY_RELEASE
const MEDIA_API = API_GATEWAY_MEDIA_RELEASE
const ROLE_API = API_GATEWAY_RELEASE
const USER_API = API_GATEWAY_RELEASE
const ORGANIZATION_API = API_GATEWAY_RELEASE
const FCM_API = API_GATEWAY_RELEASE
const SAMPLING_API = API_GATEWAY_RELEASE //'https://ilotusland.vietan-software.com' //'http://192.168.1.41:8010' //
const FTP_API = API_GATEWAY_TEST
const CAMERA_API = 'http://camera.ilotusland.vn'

const GOOGLE_MAP = {
  KEY: 'AIzaSyB2-wp_CpzQQOkmacIaA2Xj90G8E_wiJiw'
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
module.exports.SAMPLING_API = SAMPLING_API
module.exports.ROLE_API = ROLE_API
module.exports.USER_API = USER_API
module.exports.ORGANIZATION_API = ORGANIZATION_API
module.exports.FCM_API = FCM_API
module.exports.CAMERA_API = CAMERA_API
module.exports.FTP_API = FTP_API

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
  SAMPLING_API,
  ROLE_API,
  USER_API,
  ORGANIZATION_API,
  FCM_API,
  CAMERA_API,
  FTP_API
}
