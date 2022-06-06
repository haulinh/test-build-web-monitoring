import { translate } from 'hoc/create-lang'
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
    status: translate('alarm.label.management.status'),

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
    addOn: {
      edit: translate('addon.edit'),
      delete: translate('addon.delete'),
    },
    qcvnMin: translate('stationFixedPoint.form.measuringForm.qcvnMin'),
    qcvnMax: translate('stationFixedPoint.form.measuringForm.qcvnMax'),
    measure: translate('measuringManager.list.title'),
    tabs: {
      managementAlarm: translate('alarm.tabs.managementAlarm'),
      templateAlarm: translate('alarm.tabs.templateAlarm'),
      exceed: translate('alarm.tabs.exceed'),
      connection: translate('alarm.tabs.connection'),
      device: translate('alarm.tabs.device'),
    },
    toggle: {
      sendAlarm: translate('alarm.toggle.sendAlarm'),
    },
    drawer: {
      title: translate('alarm.drawer.title'),
      station: translate('alarm.drawer.station'),
      alarmType: translate('alarm.drawer.alarmType'),
      standard: translate('alarm.drawer.standard'),
      repeatSend: translate('alarm.drawer.repeatSend'),
      templateSend: translate('alarm.drawer.templateSend'),
      emailSubject: translate('alarm.drawer.emailSubject'),
      tooltip: {
        repeatSend: translate('alarm.drawer.tooltip.repeatSend'),
        customTemplate: translate('alarm.drawer.tooltip.customTemplate'),
        exceed: translate('alarm.alarmType.exceed.template'),
        device: translate('alarm.alarmType.device.template'),
        advance: translate('alarm.alarmType.advance.template'),
      },
      placeholder: {
        emailSubject: translate('alarm.drawer.placeholder.emailSubject'),
      },
    },
  }
}

export const channelOptions = [
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Web/Mobile',
    value: 'mobile',
  },
  {
    label: 'Webhook',
    value: 'webhook',
  },
]

export const channels = channelOptions.map(option => option.value)

export const getVisibleSubject = channel => {
  return ['email', 'webhook'].includes(channel)
}

export const subjectContent = alarmId => ({
  email: {
    label: 'Email Subject',
    placeholder: 'Nhập tiêu đề Email',
    fieldName: `${alarmId}.channels.email.emailSubject`,
  },
  webhook: {
    label: 'URL (POST)',
    placeholder: 'Nhập webhook URL',
    fieldName: `${alarmId}.channels.webhook.webhookUrl`,
  },
})

export const convertSecondToHrsMins = second => {
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second % 3600) / 60)

  if (hour === 0) {
    return `${min} ${i18n().time.minute}`
  }
  if (min === 0) {
    return `${hour} ${i18n().time.hour}`
  }

  return `${hour} ${i18n().time.hour} ${min} ${i18n().time.minute}`
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
