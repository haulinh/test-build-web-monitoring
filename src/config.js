const API_GATEWAY_TEST = 'http://localhost:3000'
const API_GATEWAY_RELEASE = 'http://swn.vietan-software.com:3000'

const AUTH_API = API_GATEWAY_RELEASE
<<<<<<< HEAD
const ORGANIZATION_API = 'http://localhost:1103' //API_GATEWAY_TEST
const STATION_API = API_GATEWAY_RELEASE
const CAR_API = 'http://localhost:1104'
=======
const ORGANIZATION_API = API_GATEWAY_RELEASE
const STATION_API = API_GATEWAY_RELEASE
const CATEGORY_API = API_GATEWAY_RELEASE
>>>>>>> develop
const PORT_DEPLOY = 1008

module.exports.API_GATEWAY_TEST = API_GATEWAY_TEST
module.exports.API_GATEWAY_RELEASE = API_GATEWAY_RELEASE
module.exports.AUTH_API = AUTH_API
module.exports.STATION_API = STATION_API
module.exports.ORGANIZATION_API = ORGANIZATION_API
module.exports.CAR_API = CAR_API
module.exports.PORT_DEPLOY = PORT_DEPLOY
module.exports.CATEGORY_API = CATEGORY_API

module.exports.default = {
  API_GATEWAY_TEST,
  API_GATEWAY_RELEASE,
  AUTH_API,
  STATION_API,
  ORGANIZATION_API,
<<<<<<< HEAD
  CAR_API,
=======
  CATEGORY_API,
>>>>>>> develop
  PORT_DEPLOY
}
