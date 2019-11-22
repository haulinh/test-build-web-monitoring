import { getConfigApi } from '../config'

const HOST_MEDIA = getConfigApi().media

const warningLevelImages = {
    sensorGood: `${HOST_MEDIA}/ok.png`,
    sensorError: `${HOST_MEDIA}/error.png`,
    dataExceeded: `${HOST_MEDIA}/thermometer.png`,
    dataExceededPrepared: `${HOST_MEDIA}/thermometer.png`,
    dataConnected: `${HOST_MEDIA}/wifi.png`,
    dataLoss: `${HOST_MEDIA}/wifi_off.png`,
}

export {
    warningLevelImages
}