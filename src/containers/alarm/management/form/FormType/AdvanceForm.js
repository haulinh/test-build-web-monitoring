import { Button, Col, Icon, InputNumber, Row, Select, Switch } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { FIELDS } from '../../index'
import { i18n } from '../AlarmForm'
import { v4 as uuidv4 } from 'uuid'

const ConditionItem = props => {
  return (
    <React.Fragment>
      <Row type="flex" justify="space-between" align="middle">
        <Col span={6}>
          <FormItem label={i18n().form.label.measure}>
            <SelectMeasureParameter
              //   measuringList={measuringList}
              mode="single"
            />
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label={i18n().form.label.compare}>
            <SelectOperator />
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem label={i18n().form.label.value}>
            <InputNumber style={{ width: '100%' }} />
          </FormItem>
        </Col>
        <Col>
          <Icon
            onClick={() => props.deleteConditionItem(props.conditionItem.id)}
            type="delete"
            style={{ color: '#DC4448', fontSize: 24 }}
          />
        </Col>
      </Row>
    </React.Fragment>
  )
}
class Condition extends React.Component {
  state = {
    condition: [
      {
        measure: '',
        operator: 'eq',
        value: '',
        id: uuidv4(),
      },
    ],
  }

  addConditionItem = () => {
    const { condition } = this.state
    const newCondition = [...condition, { id: uuidv4() }]
    this.setState({ condition: newCondition })
  }

  deleteConditionItem = id => {
    const { condition } = this.state
    const newCondition = condition.filter(
      conditionItem => conditionItem.id !== id
    )
    console.log({ newCondition })
    this.setState({ condition: newCondition })
  }

  render() {
    const { condition } = this.state
    console.log({ condition })
    return (
      <React.Fragment>
        {condition.map(conditionItem => (
          <ConditionItem
            conditionItem={conditionItem}
            deleteConditionItem={this.deleteConditionItem}
          />
        ))}
        <Button onClick={this.addConditionItem}>
          {translate('alarm.label.management.addCondition')}
        </Button>
      </React.Fragment>
    )
  }
}

@connect(state => ({
  alarmSelected: state.alarm.alarmSelected,
  alarmType: state.alarm.alarmType,
  isEdit: state.alarm.isEdit,
}))
export default class AdvanceForm extends React.Component {
  state = {
    condition: [],
  }

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
    return <Condition />
  }
}
