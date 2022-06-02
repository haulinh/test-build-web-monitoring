import { translate } from 'hoc/create-lang'
import { isNil } from 'lodash'
import { FIELDS } from './index'
import { v4 as uuidv4 } from 'uuid'

export const AlarmType = {
  Disconnect: 'disconnect',
  Advance: 'advance',
  Exceed: 'exceed',
  Device: 'device',
  DataLevel: 'data_level',
}

export const alarmTypeObject = {
  [AlarmType.Disconnect]: {
    template: `Station: {{station}} disconnected at {{time}}`,
  },
  [AlarmType.DataLevel]: {
    template: `{{station}}: ({{time}})
      [STATUS_DATA]- {{measure}}: {{value}} {{unit}} ({{sign}} {{config}}) {{standard}}
      [STATUS_DEVICE]- {{measure}}: Sensor {{status}}`,
  },
}

export const i18n = () => {
  return {
    alarm: translate('menuApp.alarm'),
    alarmDisconnect: translate('alarm.config.alarmDisconnect'),
    timeDisconnect: translate('alarm.config.timeDisconnect'),
    timeLabel: translate('alarm.config.time'),
    alarmExceed: translate('alarm.config.alarmExceed'),
    threshold: translate('alarm.config.threshold'),
    exceed: translate('stationAutoManager.form.qcvn.label'),
    exceed_preparing: translate('stationAutoManager.form.tendToExceed.label'),
    nameThreshold: translate('alarm.config.nameThreshold'),
    disconnect: translate('alarm.config.disconnect'),
    selectThreshold: translate('alarm.config.selectThreshold'),
    recipient: translate('alarm.label.management.recipient'),

    require: {
      selectUser: translate('alarm.config.require.selectUser'),
      selectThreshold: translate('alarm.config.require.selectThreshold'),
    },
    popConfirmDelete: translate('alarm.popconfirm.title'),
    time: {
      minute: translate('dataSearchFilterForm.selectTimeRange.minute'),
      hour: translate('dataSearchFilterForm.selectTimeRange.hour'),
      day: translate('dataSearchFilterForm.selectTimeRange.day'),
    },
    button: {
      add: translate('alarm.config.add'),
      save: translate('alarm.config.save'),
      submit: translate('global.submit'),
      cancel: translate('global.cancel'),
    },
    qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
    qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
    measure: translate('measuringManager.list.title'),
  }
}

export const channels = ['email', 'mobile', 'sms', 'webhook']
export const getHiddenParam = (typeAlarm, stationId, maxDisconnectionTime) => {
  const paramChannels = channels.reduce((base, currentChanel) => {
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
    channels: paramChannels,
    stationId,
    type: typeAlarm,
  }
  return paramHidden
}

export const getAlarmGroupByType = alarmList => {
  const initialValues = {
    alarmDisconnect: [],
    alarmStandard: [],
  }

  if (isNil(alarmList)) return []

  const alarmGroupByType = alarmList.reduce((base, current) => {
    if (current.type === FIELDS.DISCONNECT) {
      base.alarmDisconnect.push(current)
    } else if (current.type === FIELDS.DATA_LEVEL) {
      base.alarmStandard.push(current)
    }
    return base
  }, initialValues)

  return alarmGroupByType
}

export const getVisibleEmailSubject = channel => {
  return ['email', 'webhook'].includes(channel)
}

export const ALARM_LIST_INIT = {
  DISCONNECT: [
    {
      _id: uuidv4(),
      type: AlarmType.Disconnect,
      isCreateLocal: true,
      maxDisconnectionTime: 30 * 60,
      status: false,
    },
    {
      _id: uuidv4(),
      type: AlarmType.Disconnect,
      isCreateLocal: true,
      maxDisconnectionTime: 60 * 60,
      status: false,
    },
    {
      _id: uuidv4(),
      type: AlarmType.Disconnect,
      isCreateLocal: true,
      maxDisconnectionTime: 2 * 60 * 60,
      status: false,
    },
  ],
  DATA_LEVEL: [
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: AlarmType.DataLevel,
      status: false,
      config: {
        type: 'exceed',
        standardID: '',
        measuringList: [],
        name: i18n().exceed,
      },
    },
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: AlarmType.DataLevel,
      status: false,
      config: {
        type: 'exceed_preparing',
        standardID: '',
        measuringList: [],
        name: i18n().exceed_preparing,
      },
    },
  ],
  STATUS_DEVICE: [
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: AlarmType.Device,
      status: false,
      config: {
        type: 'Good',
      },
    },
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: AlarmType.Device,
      status: false,
      config: {
        type: 'Calibration',
      },
    },
    {
      _id: uuidv4(),
      isCreateLocal: true,
      type: AlarmType.Device,
      status: false,
      config: {
        type: 'Error',
      },
    },
  ],
}
