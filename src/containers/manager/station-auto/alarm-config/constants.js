import { v4 as uuidv4 } from 'uuid'
import { translate } from 'hoc/create-lang'

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
export const getHiddenParam = (typeAlarm, stationId, maxDisconnectionTime) => {
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

  const frequency = typeAlarm === 'disconnect' ? maxDisconnectionTime : 60 * 60

  const paramHidden = {
    repeatConfig: { active: true, frequency },
    channels: paramChanels,
    stationId,
    type: typeAlarm,
  }
  return paramHidden
}

export const i18n = () => {
  return {
    alarm: translate('menuApp.alarm'),
    alarmDisconnect: translate('alarm.config.alarmDisconnect'),
    timeDisconnect: translate('alarm.config.timeDisconnect'),
    alarmExceed: translate('alarm.config.alarmExceed'),
    threshold: translate('alarm.config.threshold'),
    selectThreshold: translate('alarm.config.selectThreshold'),
    recipient: translate('alarm.label.management.recipient'),
    require: {
      selectUser: translate('alarm.config.require.selectUser'),
      selectThreshold: translate('alarm.config.require.selectThreshold'),
    },
    popConfirmDelete: translate('alarm.config.popConfirmDelete'),
    time: {
      minute: translate('dataSearchFilterForm.selectTimeRange.minute'),
      hour: translate('dataSearchFilterForm.selectTimeRange.hour'),
      day: translate('dataSearchFilterForm.selectTimeRange.day'),
    },
    button: {
      add: translate('alarm.config.add'),
      save: translate('alarm.config.save'),
    },
    qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
    qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
    measure: translate('measuringManager.list.title'),
  }
}
