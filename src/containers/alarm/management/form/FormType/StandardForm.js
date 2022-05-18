import { Col, Radio, Row, Switch } from 'antd'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import { FormItem } from 'components/layouts/styles'
import SelectFrequency from 'containers/alarm/Component/SelectFrequency'
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
export default class StandardForm extends React.Component {
  componentDidMount() {
    const { alarmSelected, form } = this.props

    if (!_.isEmpty(alarmSelected)) {
      form.setFieldsValue({
        [FIELDS.REPEAT_CONFIG]: alarmSelected[FIELDS.REPEAT_CONFIG],

        [FIELDS.CONFIG]: alarmSelected[FIELDS.CONFIG],
      })
    }
  }

  render() {
    const { form, isEdit, alarmSelected } = this.props
    const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)
    const configType = form.getFieldValue(`${FIELDS.CONFIG}.${FIELDS.TYPE}`)

    return (
      <React.Fragment>
        {isEdit && (
          <FormItem label={i18n().form.label.thresholdType}>
            {form.getFieldDecorator(`${FIELDS.CONFIG}.${FIELDS.TYPE}`, {
              initialValue: 'exceed',
            })(
              <Radio.Group disabled={isEdit}>
                <Radio value="exceed">{i18n().form.label.exceed}</Radio>
                <Radio value="exceed_preparing">
                  {i18n().form.label.exceed_preparing}
                </Radio>
                <Radio value="standard">{i18n().form.label.standard}</Radio>
              </Radio.Group>
            )}
          </FormItem>
        )}

        {(configType === 'standard' || !isEdit) && (
          <Col>
            <FormItem label={i18n().form.label.standard}>
              {form.getFieldDecorator(`${FIELDS.CONFIG}.${FIELDS.STANDARD_ID}`)(
                <SelectQCVN />
              )}
            </FormItem>
          </Col>
        )}
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label={i18n().form.label.repeatConfig}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch disabled={isEdit} />)}
            </FormItem>
          </Col>

          {(alarmSelected[FIELDS.REPEAT_CONFIG] || repeatConfig) && (
            <Col span={8}>
              <FormItem label={i18n().form.label.frequency}>
                {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`, {
                  initialValue: 3600,
                })(<SelectFrequency disabled={true} />)}
              </FormItem>
            </Col>
          )}
        </Row>
      </React.Fragment>
    )
  }
}
