import { Form } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { FIELDS } from '../index'

const getStatusAlarm = status => {
  if (status) return 'enable'
  return 'disable'
}

const getStatusAlarmBoolean = status => {
  if (status === 'enable') return true
  return false
}

export const isDefaultDataLevel = alarmConfigType =>
  [FIELDS.EXCEED, FIELDS.EXCEED_PREPARING].includes(alarmConfigType)

const withAlarmForm = WrappedComponent => {
  @Form.create()
  class AlarmForm extends React.Component {
    state = {
      alarmIdsDeleted: [],
      visibleAlarmDetail: false,
    }

    standardFormRef = React.createRef()

    getQueryParamGeneral = () => {
      const { form } = this.props
      const value = form.getFieldsValue()

      const paramsForm = Object.values(value)

      const params = paramsForm.map(({ isCreateLocal, ...paramItem }) => ({
        ...paramItem,

        recipients: get(paramItem, 'recipients', []).flat(),
        _id: !isCreateLocal ? paramItem._id : null,
        status: getStatusAlarm(paramItem.status),
      }))

      return params
    }

    setFormValues = alarmList => {
      const { form } = this.props

      const alarmFormValuesFormatted = alarmList
        .map(item => ({
          ...item,
          status:
            typeof item.status === 'boolean'
              ? item.status
              : getStatusAlarmBoolean(item.status),
        }))
        .reduce((base, current) => ({ ...base, [current._id]: current }), {})

      form.setFieldsValue(alarmFormValuesFormatted)
    }

    handleSubmit = () => {
      const paramsForm = this.getQueryParamGeneral()
      console.log({ paramsForm })
    }

    setIdsDeleted = id => {
      const { alarmIdsDeleted } = this.state
      this.setState({ alarmIdsDeleted: [...alarmIdsDeleted, id] })
    }

    handleShowAlarmDetail = () => {
      this.setState({ visibleAlarmDetail: true })
    }

    handleCloseAlarmDetail = () => {
      this.setState({ visibleAlarmDetail: false })
    }

    render() {
      return (
        <WrappedComponent
          {...this} // pass all property class to prop
          {...this.props}
          {...this.state}
        />
      )
    }
  }

  return AlarmForm
}

export default withAlarmForm
