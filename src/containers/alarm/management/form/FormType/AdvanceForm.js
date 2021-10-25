import { Col, InputNumber, Row, Switch } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { FIELDS } from '../../index'
import { i18n } from '../AlarmForm'

@connect(state => ({
  alarmSelected: state.alarm.alarmSelected,
  alarmType: state.alarm.alarmType,
  isEdit: state.alarm.isEdit,
}))
export default class AdvanceForm extends React.Component {
  componentDidMount() {
    const { alarmSelected, form } = this.props
    if (!_.isEmpty(alarmSelected)) {
      form.setFieldsValue({
        [FIELDS.MAX_DISCONNECTION_TIME]:
          alarmSelected[FIELDS.MAX_DISCONNECTION_TIME] / 60,
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { alarmSelected, form } = this.props
    if (
      !_.isEmpty(alarmSelected) &&
      prevProps.alarmSelected !== alarmSelected
    ) {
      form.setFieldsValue({
        [FIELDS.MAX_DISCONNECTION_TIME]:
          alarmSelected[FIELDS.MAX_DISCONNECTION_TIME] / 60,
      })
    }
  }

  render() {
    const { form, isEdit } = this.props
    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <Col span={16}>
            <FormItem
              marginBottom="0px"
              label={i18n().form.label.disconnectionTime}
            >
              {form.getFieldDecorator(FIELDS.MAX_DISCONNECTION_TIME, {
                rules: [
                  {
                    required: true,
                    message: translate('alarm.required.disconnectionTime'),
                  },
                ],
              })(<InputNumber disabled={isEdit} style={{ width: '100%' }} />)}
            </FormItem>
            <span>{translate('alarm.suggest.disconnectionTime')}</span>
          </Col>
          <Col span={5}>
            <FormItem marginBottom="0px" label={i18n().form.label.repeatConfig}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch disabled={isEdit} />)}
            </FormItem>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
