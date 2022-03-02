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

export const ALARM_LIST_INIT = [
  {
    _id: uuidv4(),
    recipients: [
      "6008e96e6854d4001bc3053c",
      "5aaf82a2eefc200a2266f9c2",
      "6193126d315aa0001c4b5959"
    ],
    type: 'disconnect',
    maxDisconnectionTime: 30,
  },
  {
    _id: uuidv4(),
    recipients: [
      "6008e96e6854d4001bc3053c",
      "5aaf82a2eefc200a2266f9c2",
      "6193126d315aa0001c4b5959"
    ],
    type: 'disconnect',
    maxDisconnectionTime: 60,
  },
  {
    _id: uuidv4(),
    recipients: [
      "6008e96e6854d4001bc3053c",
      "5aaf82a2eefc200a2266f9c2",
      "6193126d315aa0001c4b5959"
    ],
    type: 'disconnect',
    maxDisconnectionTime: 240,
  },
]

const chanels = ['email', 'mobile', 'sms', 'webhook']
export const getHiddenParam = (typeAlarm, stationId) => {
  const paramChanels = chanels.reduce((base, currentChanel) => {
    const valueChanel = {
      active: true,
      type: currentChanel,
      template: alarmTypeObject[typeAlarm]
    }
    return {
      ...base,
      [currentChanel]: valueChanel
    }
  }, {})

  const paramHidden = {
    repeatConfig: { active: true },
    channels: paramChanels,
    stationId,
    type: typeAlarm
  }
  return paramHidden
}
