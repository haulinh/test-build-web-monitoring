import { Form } from 'antd'
import { get, isEmpty, isNil, keyBy } from 'lodash'
import React from 'react'
import { getHiddenParam } from '../constants'
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

    getQueryParam = (alarmType, stationId) => {
      const { form } = this.props
      const value = form.getFieldsValue()

      const paramsForm = Object.values(value[alarmType] || {})

      const params = paramsForm
        .map(({ isCreateLocal, ...paramItem }) => ({
          ...paramItem,

          ...(alarmType === FIELDS.DATA_LEVEL && {
            config: {
              ...paramItem.config,
              type: paramItem.config.type || 'standard',
              [FIELDS.MEASURING_LIST]: this.getMeasureListEnable(),
            },
          }),

          recipients: get(paramItem, 'recipients', []).flat(),
          _id: !isCreateLocal ? paramItem._id : null,
          status: getStatusAlarm(paramItem.status),

          ...getHiddenParam(
            alarmType,
            stationId,
            paramItem.maxDisconnectionTime
          ),
        }))

        .filter(paramItem => {
          if (isEmpty(paramItem.recipients)) return false

          if (alarmType === FIELDS.DATA_LEVEL) {
            const configAlarmType = get(paramItem, 'config.type')

            if (isDefaultDataLevel(configAlarmType)) return true

            if (isNil(get(paramItem, 'config.standardId'))) return false
          }

          return true
        })

      return params
    }

    getMeasureListEnable = () => {
      // let config = null
      const standardForm = this.standardFormRef.current

      const measureListEnable = Object.entries(standardForm.getFieldsValue())
        .filter(([, value]) => Boolean(value))
        .map(([keyMeasure]) => keyMeasure)

      return measureListEnable
    }

    setFormValues = (alarmType, alarmList) => {
      const { form } = this.props
      const alarmFormValues = keyBy(alarmList, '_id')
      const alarmFormValuesFormat = Object.values(alarmFormValues)
        .map(item => ({
          ...item,
          status:
            typeof item.status === 'boolean'
              ? item.status
              : getStatusAlarmBoolean(item.status),
        }))
        .reduce((base, current) => ({ ...base, [current._id]: current }), {})
      const alarmFormValuesType = {
        [alarmType]: alarmFormValuesFormat,
      }

      form.setFieldsValue(alarmFormValuesType)
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
