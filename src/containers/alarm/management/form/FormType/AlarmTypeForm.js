import React from 'react'
import { alarmType, FIELDS } from '../../index'
import DeviceForm from './DeviceForm'
import DisconnectForm from './DisconnectForm'
import ExceedForm from './ExceedForm'

export const AlarmTypeForm = ({ form }) => {
  const type = form.getFieldValue(FIELDS.TYPE)

  if (type === alarmType.disconnect.value) {
    return <DisconnectForm form={form} />
  }

  if (type === alarmType.exceed.value) {
    return <ExceedForm form={form} />
  }

  if (type === alarmType.device.value) {
    return <DeviceForm form={form} />
  }

  return <React.Fragment />
}
