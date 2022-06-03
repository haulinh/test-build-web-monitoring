import { Form, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { translate } from 'hoc/create-lang'
import { get, isEmpty, isEqual, isNil } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { getAlarms, updateDetailAlarm } from 'redux/actions/alarm'
import { selectStationById } from 'redux/actions/globalAction'
import { alarmTypeObject, channels, getVisibleEmailSubject } from '../constants'
import { FIELDS } from '../index'

export const getStatusAlarm = status => {
  if (status) return 'enable'
  return 'disable'
}

export const getStatusAlarmBoolean = status => {
  if (status === 'enable') return true
  return false
}

export const isDefaultDataLevel = alarmConfigType =>
  [FIELDS.EXCEED, FIELDS.EXCEED_PREPARING].includes(alarmConfigType)

const withAlarmForm = WrappedComponent => {
  @connect(state => ({
    selectStationById: stationId => selectStationById(state, stationId),
  }))
  @Form.create()
  @connect(null, { getAlarms, updateDetailAlarm })
  class AlarmForm extends React.Component {
    state = {
      alarmIdsDeleted: [],
      visibleAlarmDetail: false,
      alarmDetail: {},
    }

    standardFormRef = React.createRef()

    state = {
      alarmIdsDeleted: [],
    }

    componentDidMount = () => {
      const { dataSource } = this.props

      this.setFormValues(dataSource)
    }

    componentDidUpdate = (prevProps, prevState) => {
      const { dataSource } = this.props

      if (!isEqual(prevProps.dataSource, dataSource)) {
        this.setFormValues(dataSource)
      }

      this.handleAlarmStatusChange(prevProps)
    }

    getQueryParamGeneral = () => {
      const { form } = this.props
      const value = form.getFieldsValue()

      const paramsForm = Object.values(value)

      const params = paramsForm
        .map(({ isCreateLocal, ...paramItem }) => ({
          ...paramItem,

          recipients: get(paramItem, 'recipients', []).flat(),
          _id: !isCreateLocal ? paramItem._id : null,
          status: getStatusAlarm(paramItem.status),
        }))
        .filter(paramItem => !isEmpty(paramItem.recipients))

      return params
    }

    setFormValues = alarmList => {
      if (isEmpty(alarmList)) return

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

    setHiddenFields = (alarmDetail, alarmType) => {
      const { form } = this.props

      channels.forEach(channel => {
        const visibleEmailSubject = getVisibleEmailSubject(channel)

        form.getFieldDecorator(
          `${alarmDetail._id}.channels.${channel}.active`,
          {
            initialValue: get(alarmDetail, `channels.${channel}.active`, true),
          }
        )
        form.getFieldDecorator(`${alarmDetail._id}.channels.${channel}.type`, {
          initialValue: channel,
        })
        form.getFieldDecorator(
          `${alarmDetail._id}.channels.${channel}.template`,
          {
            initialValue: get(
              alarmDetail,
              `channels.${channel}.template`,
              alarmTypeObject[alarmType].template
            ),
          }
        )
        form.getFieldDecorator(
          `${alarmDetail._id}.channels.${channel}.customTemplate`,
          {
            initialValue: get(
              alarmDetail,
              `channels.${channel}.customTemplate`
            ),
          }
        )

        if (visibleEmailSubject) {
          form.getFieldDecorator(
            `${alarmDetail._id}.channels.${channel}.emailSubject`,
            { initialValue: '' }
          )
        }
      })

      form.getFieldDecorator(`${alarmDetail._id}.repeatConfig.active`, {
        initialValue: get(alarmDetail, 'repeatConfig.active', true),
      })

      form.getFieldDecorator(`${alarmDetail._id}.repeatConfig.frequency`, {
        initialValue: get(alarmDetail, 'repeatConfig.active.frequency', 3600),
      })

      form.getFieldDecorator(`${alarmDetail._id}.type`, {
        initialValue: alarmType,
      })

      form.getFieldDecorator(`${alarmDetail._id}.stationId`, {
        initialValue: alarmDetail.stationId,
      })
    }

    handleSubmitAlarm = async paramGeneral => {
      const { alarmIdsDeleted } = this.state
      const { getAlarms } = this.props

      const params = {
        data: paramGeneral,
        deletedIds: alarmIdsDeleted,
      }

      try {
        await CalculateApi.createBulkAlarm(params)
        getAlarms()
        message.success(translate('global.saveSuccess'))
      } catch (error) {
        message.error(translate('ticket.message.notificationError'))
      }
    }

    setAlarmDetail = alarmDetail => {
      this.setState({ alarmDetail })
    }

    handleShowAlarmDetail = () => {
      this.setState({ visibleAlarmDetail: true })
    }

    handleCloseAlarmDetail = () => {
      this.setState({ visibleAlarmDetail: false })
    }

    setIdsDeleted = id => {
      const { alarmIdsDeleted } = this.state
      const newIdsDeleted = [...alarmIdsDeleted, id]

      this.setState({ alarmIdsDeleted: newIdsDeleted })
    }

    handleAlarmStatusChange = prevProps => {
      const { dataSource, selectStationById, stationId, form } = this.props

      if (isEmpty(dataSource)) return

      if (
        !isEqual(
          selectStationById(stationId).alarmConfig,
          prevProps.selectStationById(stationId).alarmConfig
        )
      ) {
        const fieldsValueStatusAlarm = dataSource.reduce(
          (base, currentAlarm) => ({
            ...base,
            [`${currentAlarm._id}.${FIELDS.STATUS}`]: getStatusAlarmBoolean(
              selectStationById(stationId).alarmConfig.status
            ),
          }),

          {}
        )

        form.setFieldsValue(fieldsValueStatusAlarm)
      }
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
