import { Button, Form, Input, Select, Icon, message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import CDrawer from 'components/core/drawer'
import SelectUser from 'components/elements/select-data/SelectUser'
import SelectStationAuto from 'components/elements/select-station-auto'
import { Flex, FormItem } from 'components/layouts/styles'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearAlarmSelected } from 'redux/actions/alarm'
import { alarmType, FIELDS } from '../index'
import { AlarmTypeForm } from './FormType/AlarmTypeForm'
import { ChanelForm } from './ChanelForm'

export const i18n = () => ({
  drawer: {
    title: t('alarm.title.createAlarm'),
  },
  form: {
    label: {
      name: t('alarm.label.management.name'),
      type: t('alarm.label.management.type'),
      disconnectionTime: t('alarm.label.management.disconnectionTime'),
      repeatConfig: t('alarm.label.management.repeatConfig'),
      station: t('alarm.label.management.station'),
      measure: t('alarm.label.management.measure'),
      device: t('alarm.label.management.device'),
      compare: t('alarm.label.management.compare'),
      value: t('alarm.label.management.value'),
      status: t('alarm.label.management.status'),
      recipient: t('alarm.label.management.recipient'),
      frequency: t('alarm.label.management.frequency'),
    },
    placeholder: {
      name: t('alarm.label.management.name'),
    },
  },
  error: {
    required: t('ticket.required.configProperties.required'),
    isNumber: t('ticket.required.configProperties.isNumber'),
    max64: t('rules.max64'),
  },
  button: {
    add: t('alarm.title.createAlarm'),
  },
})

@Form.create()
@connect(
  state => ({
    alarmSelected: state.alarm.alarmSelected,
    alarmType: state.alarm.alarmType,
    isEdit: state.alarm.isEdit,
  }),
  {
    clearAlarmSelected,
  }
)
export default class AlarmForm extends Component {
  state = {
    isModalVisible: false,
    categories: [],
  }

  clearFields = () => {
    const { form } = this.props
    form.resetFields()
  }

  componentDidUpdate(prevProps) {
    const { alarmSelected, form } = this.props
    if (prevProps.alarmSelected !== alarmSelected) {
      const fieldsValue = this.getFieldsValueGeneral()
      form.setFieldsValue(fieldsValue)
    }
  }

  getFieldsValueGeneral = () => {
    const { alarmSelected } = this.props
    return _.pick(alarmSelected, [
      FIELDS.NAME,
      FIELDS.STATION_ID,
      FIELDS.RECIPIENTS,
      FIELDS.REPEAT_CONFIG,
      FIELDS.TYPE,
      FIELDS.CHANNELS,
    ])
  }

  getParam = type => {
    const param = {
      disconnect: this.getParamDisconnect,
      advance: '',
      exceed: this.getParamExceed,
      device: this.getParamDevice,
    }
    return param[type]()
  }

  getParamDisconnect = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    return values
  }

  getParamExceed = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const param = {
      ...values,
      [FIELDS.CONDITIONS]: [
        {
          ...values[FIELDS.CONDITIONS],
          valueType: 'value',
          field: 'value',
        },
      ],
    }
    return param
  }

  getParamDevice = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    const param = {
      ...values,
      [FIELDS.CONDITIONS]: [
        {
          ...values[FIELDS.CONDITIONS],
          valueType: 'value',
          field: 'statusDevice',
        },
      ],
    }
    return param
  }

  onSubmit = async e => {
    e.preventDefault()
    const { form, onClose, getData, alarmSelected, isEdit } = this.props
    const values = await form.validateFields()

    if (!values) return

    const type = values[FIELDS.TYPE]
    const param = this.getParam(type)

    try {
      if (isEdit) {
        await CalculateApi.updateAlarmById(alarmSelected._id, param)
        message.success(t('alarm.message.management.updateSuccess'))
      } else {
        await CalculateApi.createAlarm(param)
        console.log({ param })
        message.success(t('alarm.message.management.createSuccess'))
      }
    } catch (error) {
      message.error(t('alarm.message.management.createError'))
    }

    getData()
    form.resetFields()
    onClose()
  }

  handleOnClose = async () => {
    const { onClose, clearAlarmSelected, form } = this.props
    form.resetFields()
    onClose()
    clearAlarmSelected()
  }

  getPopupContainer(trigger) {
    return trigger.parentElement
  }
  render() {
    const { visible, form, alarmSelected, isEdit } = this.props

    return (
      <CDrawer
        closable={false}
        onClose={this.handleOnClose}
        visible={visible}
        width={400}
        title={alarmSelected.name || i18n().drawer.title}
        right={<Icon type="close" onClick={this.handleOnClose} />}
      >
        <Form
          style={{ height: '100%' }}
          layout="vertical"
          onSubmit={this.onSubmit}
        >
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <div>
              <FormItem label={i18n().form.label.name}>
                {form.getFieldDecorator(FIELDS.NAME, {
                  rules: [
                    {
                      required: true,
                      message: i18n().error.required,
                    },
                    {
                      max: 64,
                      message: i18n().error.max64,
                    },
                    {
                      whitespace: true,
                      message: i18n().error.required,
                    },
                  ],
                })(<Input placeholder={i18n().form.placeholder.name} />)}
              </FormItem>

              <FormItem label={i18n().form.label.type}>
                {form.getFieldDecorator(FIELDS.TYPE, {
                  rules: [
                    {
                      required: true,
                      message: i18n().error.required,
                    },
                  ],
                  initialValue: 'disconnect',
                })(
                  <Select disabled={isEdit} getPopupContainer={this.getPopupContainer}>
                    {Object.values(alarmType).map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label()}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>

              <FormItem label={i18n().form.label.station}>
                {form.getFieldDecorator(FIELDS.STATION_ID, {
                  rules: [
                    {
                      required: true,
                      message: t('ticket.required.incident.stationName'),
                    },
                  ],
                })(<SelectStationAuto disabled={isEdit} fieldValue="_id" getPopupContainer={this.getPopupContainer} />)}
              </FormItem>

              <AlarmTypeForm form={form} getPopupContainer={this.getPopupContainer} />

              <FormItem label={i18n().form.label.recipient}>
                {form.getFieldDecorator(FIELDS.RECIPIENTS, {
                  rules: [
                    {
                      required: true,
                      message: t('ticket.required.incident.recipient'),
                    },
                  ],
                })(<SelectUser mode="multiple" getPopupContainer={this.getPopupContainer} />)}
              </FormItem>

              <FormItem>
                <ChanelForm form={form} />
              </FormItem>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                alignSelf: 'end',
                height: 32,
                minHeight: 32,
              }}
            >
              {isEdit ? t('global.save') : i18n().button.add}
            </Button>
            <div style={{ height: 12, minHeight: 12 }} />
          </Flex>
        </Form>
      </CDrawer>
    )
  }
}
