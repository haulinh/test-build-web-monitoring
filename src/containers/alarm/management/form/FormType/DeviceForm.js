import { Col, Row, Switch } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import SelectFrequency from 'containers/alarm/Component/SelectFrequency'
import SelectStatusDevice from 'containers/alarm/Component/SelectStatusDevice'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { FIELDS } from '../../index'
import { i18n } from '../AlarmForm'

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
    alarmSelected: state.alarm.alarmSelected,
    alarmType: state.alarm.alarmType,
    isEdit: state.alarm.isEdit,
  }
}

@connect(mapStateToProp)
export default class DeviceForm extends React.Component {
  componentDidMount() {
    const { alarmSelected, form } = this.props

    if (!_.isEmpty(alarmSelected)) {
      const condition = _.get(alarmSelected, `${[FIELDS.CONDITIONS]}.0`, {})
      form.setFieldsValue({
        [FIELDS.CONDITIONS]: condition,
        [FIELDS.REPEAT_CONFIG]: alarmSelected[FIELDS.REPEAT_CONFIG],
      })
    }
  }

  render() {
    const { form, stationAutoById, isEdit, getPopupContainer } = this.props
    const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)
    const stationIdSelected = form.getFieldValue(FIELDS.STATION_ID)
    const measuringList = _.get(
      stationAutoById,
      `${stationIdSelected}.measuringList`,
      []
    )

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <FormItem label={i18n().form.label.device}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.measure`, {
                rules: [
                  {
                    required: true,
                    message: translate('ticket.required.incident.measure'),
                  },
                ],
              })(
                <SelectMeasureParameter
                  disabled={isEdit}
                  measuringList={measuringList}
                  mode="single"
                  getPopupContainer={getPopupContainer}
                />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label={i18n().form.label.compare}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.operator`, {
                initialValue: 'eq',
              })(
                <SelectOperator
                  disabled
                  getPopupContainer={getPopupContainer}
                />
              )}
            </FormItem>
          </Col>

          <Col span={10}>
            <FormItem label={i18n().form.label.status}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.value`, {
                rules: [
                  {
                    required: true,
                    message: translate('aqiConfigCalculation.required'),
                  },
                ],
              })(
                <SelectStatusDevice
                  disabled={isEdit}
                  style={{ width: '100%' }}
                  getPopupContainer={getPopupContainer}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col span={8}>
            <FormItem label={i18n().form.label.repeatConfig}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch disabled={isEdit} />)}
            </FormItem>
          </Col>
          {repeatConfig && (
            <Col span={8}>
              <FormItem label={i18n().form.label.frequency}>
                {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`, {
                  initialValue: 15,
                })(<SelectFrequency disabled={isEdit} />)}
              </FormItem>
            </Col>
          )}
        </Row>
      </React.Fragment>
    )
  }
}
