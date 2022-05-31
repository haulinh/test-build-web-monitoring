import { Form, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { translate } from 'hoc/create-lang'
import { get, keyBy } from 'lodash'
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
    standardFormRef = React.createRef()

    state = {
      alarmIdsDeleted: [],
    }

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
      const alarmFormValues = keyBy(alarmList, '_id')
      const alarmFormValuesFormatted = Object.values(alarmFormValues)
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

    handleSubmitAlarm = async paramGeneral => {
      const { alarmIdsDeleted } = this.state
      const params = {
        data: paramGeneral,
        deletedIds: alarmIdsDeleted,
      }

      try {
        await CalculateApi.createBulkAlarm(params)
        message.success(translate('global.saveSuccess'))
      } catch (error) {
        console.error(error)
        message.error(translate('ticket.message.notificationError'))
      }
    }

    handleAlarmIdsDeleted = id => {
      const { alarmIdsDeleted } = this.state
      const newIdsDeleted = [...alarmIdsDeleted, id]

      this.setState({ alarmIdsDeleted: newIdsDeleted })
    }

    render() {
      return (
        <WrappedComponent
          {...this} // pass all property class to prop
          {...this.props}
        />
      )
    }
  }

  return AlarmForm
}

export default withAlarmForm
