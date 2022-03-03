import { v4 as uuidv4 } from 'uuid'

export const alarmTypeObject = {
  disconnect: {
    template: `Station: {{station}} disconnected at {{time}}`,
  },
  advance: {
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
      maxDisconnectionTime: 30 * 60,
    },
    {
      _id: uuidv4(),
      type: 'disconnect',
      maxDisconnectionTime: 60 * 60,
    },
    {
      _id: uuidv4(),
      type: 'disconnect',
      maxDisconnectionTime: 2 * 60 * 60,
    },
  ],
  BY_STANDARD: [
    {
      _id: uuidv4(),
      type: 'by_standard',
    },
    {
      _id: uuidv4(),
      type: 'by_standard',
    },
    {
      _id: uuidv4(),
      type: 'by_standard',
    },
  ],
}

const chanels = ['email', 'mobile', 'sms', 'webhook']
export const getHiddenParam = (typeAlarm, stationId) => {
  const paramChanels = chanels.reduce((base, currentChanel) => {
    const valueChanel = {
      active: true,
      type: currentChanel,
      template: alarmTypeObject[typeAlarm],
    }
    return {
      ...base,
      [currentChanel]: valueChanel,
    }
  }, {})

  const paramHidden = {
    repeatConfig: { active: true },
    channels: paramChanels,
    stationId,
    type: typeAlarm,
  }
  return paramHidden
}
