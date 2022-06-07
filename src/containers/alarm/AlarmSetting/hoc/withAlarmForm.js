import { Form, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import { translate } from 'hoc/create-lang'
import { get, isEmpty, isEqual } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { getAlarms, updateDetailAlarm } from 'redux/actions/alarm'
import { selectStationById } from 'redux/actions/globalAction'
import {
  alarmTypeObject,
  channels,
  getVisibleSubject,
  subjectContent,
} from '../constants'
import { FIELDS } from '../index'

export const getStatusAlarm = status => {
  if (status) return 'enable'
  return 'disable'
}

export const getStatusAlarmBoolean = status => {
  if (status === 'enable') return true
  return false
}

export const setFormValues = (form, alarmList) => {
  if (isEmpty(alarmList)) return

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
      loadingSubmit: false,
    }

    componentDidMount = () => {
      const { dataSource } = this.props

      this.setFormValues(dataSource)
    }

    componentDidUpdate(prevProps, prevState) {
      const { loadingSubmit } = this.state
      const { dataSource } = this.props
      if (prevState.loadingSubmit !== loadingSubmit) {
        this.setFormValues(dataSource)
      }
    }

    getQueryParamGeneral = () => {
      const { form } = this.props
      const value = form.getFieldsValue()

      const paramsForm = Object.values(value).filter(
        paramsItem => !isEmpty(paramsItem.recipients)
      )

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

    handleSubmitAlarm = async paramGeneral => {
      const { alarmIdsDeleted } = this.state
      const { getAlarms, dataSource } = this.props

      const params = {
        data: paramGeneral,
        deletedIds: alarmIdsDeleted,
      }

      try {
        this.setState({ loadingSubmit: true })
        await CalculateApi.createBulkAlarm(params)
        await getAlarms()
        this.setFormValues(dataSource)
        message.success(translate('global.saveSuccess'))
      } catch (error) {
        console.error(error)
        message.error(translate('ticket.message.notificationError'))
      } finally {
        this.setState({ loadingSubmit: false })
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

    setHiddenFields = (alarmDetail, alarmType) => {
      const { form } = this.props

      channels.forEach(channel => {
        const visibleEmailSubject = getVisibleSubject(channel)

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
            subjectContent(alarmDetail._id)[channel].fieldName,
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
