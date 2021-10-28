import React from 'react'
import { alarmType, FIELDS } from '../../index'
import DeviceForm from './DeviceForm'
import DisconnectForm from './DisconnectForm'
import ExceedForm from './ExceedForm'
import AdvanceForm from './AdvanceForm'

class AlarmTypeForm extends React.Component {
  renderForm = () => {
    const { form, getPopupContainer, innerRef } = this.props
    const type = form.getFieldValue(FIELDS.TYPE)

    if (type === alarmType.disconnect.value) {
      return <DisconnectForm form={form} />
    }

    if (type === alarmType.exceed.value) {
      return <ExceedForm form={form} getPopupContainer={getPopupContainer} />
    }

    if (type === alarmType.device.value) {
      return <DeviceForm form={form} getPopupContainer={getPopupContainer} />
    }

    if (type === alarmType.advance.value) {
      return <AdvanceForm wrappedComponentRef={innerRef} />
    }

    return <React.Fragment />
  }

  render() {
    return <React.Fragment>{this.renderForm()}</React.Fragment>
  }
}

export const AlarmTypeFormWrapper = React.forwardRef((props, ref) => (
  <AlarmTypeForm innerRef={ref} {...props} />
))
