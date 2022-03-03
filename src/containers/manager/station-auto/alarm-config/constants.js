import { v4 as uuidv4 } from 'uuid'

export const alarmTypeObject = {
  disconnect: {
    template: `Station: {{station}} disconnected at {{time}}`,
  },
  by_standard: {
    template: `{{station}}: ({{time}})
[STATUS_DATA]- {{measure}}: {{value}} {{unit}} ({{sign}} {{config}})
[STATUS_DEVICE]- {{measure}}: Sensor {{status}}`,
  },
}

export const ALARM_LIST_INIT = {
  DISCONNECT: [
    {
      _id: uuidv4(),
      type: 'disconnect',
      isCreateLocal: true,
      maxDisconnectionTime: 30 * 60,
      status: false,
    },
    {
      _id: uuidv4(),
      type: 'disconnect',
      isCreateLocal: true,
      maxDisconnectionTime: 60 * 60,
      status: false,
    },
    {
      _id: uuidv4(),
      type: 'disconnect',
      isCreateLocal: true,
      maxDisconnectionTime: 2 * 60 * 60,
      status: false,
    },
  ],
  BY_STANDARD: [
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: 'by_standard',
      status: false,
    },
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: 'by_standard',
      status: false,
    },
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: 'by_standard',
      status: false,
    },
  ],
}

const chanels = ['email', 'mobile', 'sms', 'webhook']
export const getHiddenParam = (typeAlarm, stationId) => {
  const paramChanels = chanels.reduce((base, currentChanel) => {
    const valueChanel = {
      active: true,
      type: currentChanel,
      template: alarmTypeObject[typeAlarm].template,
    }
    return {
      ...base,
      [currentChanel]: valueChanel,
    }
  }, {})

  const paramHidden = {
    repeatConfig: { active: true, frequency: 60 * 60 },
    channels: paramChanels,
    stationId,
    type: typeAlarm,
  }
  return paramHidden
}
