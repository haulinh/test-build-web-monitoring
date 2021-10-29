import { Col, InputNumber, Row, Switch } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import SelectFrequency from 'containers/alarm/Component/SelectFrequency'
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
export default class ExceedForm extends React.Component {
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
            <FormItem label={i18n().form.label.measure}>
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
          <Col span={6}>
            <FormItem label={i18n().form.label.compare}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.operator`, {
                initialValue: 'eq',
              })(
                <SelectOperator
                  disabled={isEdit}
                  getPopupContainer={getPopupContainer}
                />
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label={i18n().form.label.value}>
              {form.getFieldDecorator(`${FIELDS.CONDITIONS}.value`, {
                rules: [
                  {
                    required: true,
                    message: translate('aqiConfigCalculation.required'),
                  },
                ],
              })(<InputNumber disabled={isEdit} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={8}>
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
                })(
                  <SelectFrequency
                    disabled={isEdit}
                    style={{ width: '100%' }}
                    getPopupContainer={getPopupContainer}
                  />
                )}
              </FormItem>
            </Col>
          )}
        </Row>
      </React.Fragment>
    )
  }
}
