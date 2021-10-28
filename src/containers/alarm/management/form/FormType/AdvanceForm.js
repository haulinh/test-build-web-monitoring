import {
  Button,
  Col,
  Dropdown,
  Form,
  Icon,
  InputNumber,
  Menu,
  Row,
  Switch,
} from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { Clearfix, FormItem } from 'components/layouts/styles'
import SelectClause from 'containers/alarm/Component/SelectClause'
import SelectFrequency from 'containers/alarm/Component/SelectFrequency'
import SelectStatusDevice from 'containers/alarm/Component/SelectStatusDevice'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../../index'
import { i18n } from '../AlarmForm'
import styled from 'styled-components'

const ConditionWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #d0d8e2;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 16px;
`

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
    stationIdSelected: state.alarm.stationIdSelected,
    isEdit: state.alarm.isEdit,
  }
}

const ConditionItem = connect(mapStateToProp)(
  ({ deleteConditionItem, conditionItem, form, index, ...otherProps }) => {
    const measuringList = _.get(
      otherProps.stationAutoById,
      `${otherProps.stationIdSelected}.measuringList`,
      []
    )

    const isStatusDevice = conditionItem.field === 'statusDevice'
    const isFirstItem = index === 0

    const Col3 = type => {
      const Component = {
        value: () => (
          <React.Fragment>
            <FormItem label={i18n().form.label.value}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.value`,
                {
                  rules: [
                    {
                      required: true,
                      message: translate('aqiConfigCalculation.required'),
                    },
                  ],
                }
              )(
                <InputNumber
                  disabled={otherProps.isEdit}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${conditionItem.id}.valueType`,
              { initialValue: 'value' }
            )(<div />)}
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${conditionItem.id}.field`,
              { initialValue: 'value' }
            )(<div />)}
          </React.Fragment>
        ),
        statusDevice: () => (
          <React.Fragment>
            <FormItem label={i18n().form.label.value}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.value`,
                {
                  rules: [
                    {
                      required: true,
                      message: translate('aqiConfigCalculation.required'),
                    },
                  ],
                }
              )(
                <SelectStatusDevice
                  disabled={otherProps.isEdit}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${conditionItem.id}.valueType`,
              { initialValue: 'value' }
            )(<div />)}
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${conditionItem.id}.field`,
              { initialValue: 'statusDevice' }
            )(<div />)}
          </React.Fragment>
        ),
        undefined: () => <React.Fragment />,
      }
      return Component[type]()
    }

    return (
      <React.Fragment>
        {!isFirstItem && (
          <React.Fragment>
            <Row>
              <Col span={6}>
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${conditionItem.id}.clause`,
                  { initialValue: 'and' }
                )(
                  <SelectClause
                    disabled={otherProps.isEdit}
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
            </Row>
            <Clearfix height={4} />
          </React.Fragment>
        )}

        <Row type="flex" justify="space-between" align="middle">
          <Col span={6}>
            <FormItem label={i18n().form.label.measure}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.measure`,
                {
                  rules: [
                    {
                      required: true,
                      message: translate('ticket.required.incident.measure'),
                    },
                  ],
                }
              )(
                <SelectMeasureParameter
                  disabled={otherProps.isEdit}
                  measuringList={measuringList}
                  mode="single"
                />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={i18n().form.label.compare}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.operator`,
                { initialValue: 'eq' }
              )(
                <SelectOperator
                  disabled={isStatusDevice || otherProps.isEdit}
                />
              )}
            </FormItem>
          </Col>

          <Col span={6}>{Col3(conditionItem.field)}</Col>
          {!otherProps.isEdit && (
            <Col span={3}>
              <Icon
                onClick={() => deleteConditionItem(conditionItem.id)}
                type="delete"
                style={{ color: '#DC4448', fontSize: 24 }}
              />
            </Col>
          )}
        </Row>
        <Clearfix height={8} />
      </React.Fragment>
    )
  }
)

@connect(state => ({
  alarmSelected: state.alarm.alarmSelected,
  alarmType: state.alarm.alarmType,
  isEdit: state.alarm.isEdit,
}))
class AdvanceForm extends React.Component {
  state = {
    typeCondition: '',
    conditions: [],
  }

  setInitValue = () => {
    const { alarmSelected, form } = this.props

    this.setState({ conditions: alarmSelected.conditions }, () => {
      const conditionFieldValue = alarmSelected.conditions.reduce(
        (base, current) => ({ ...base, [current.id]: current }),
        {}
      )

      form.setFieldsValue({ [FIELDS.CONDITIONS]: conditionFieldValue })
    })
  }

  componentDidMount() {
    const { alarmSelected } = this.props
    if (!_.isEmpty(alarmSelected)) {
      this.setInitValue()
    }
  }

  addConditionItem = value => {
    const { conditions } = this.state
    const newConditions = [...conditions, { id: uuidv4(), field: value }]
    this.setState({ conditions: newConditions })
  }

  deleteConditionItem = id => {
    const { conditions } = this.state
    const newConditions = conditions.filter(
      conditionItem => conditionItem.id !== id
    )
    this.setState({ conditions: newConditions })
  }

  onChangeCondition = value => {
    this.setState({ typeCondition: value })
  }

  menu = (
    <Menu>
      <Menu.Item onClick={() => this.addConditionItem('value')}>
        {translate('alarm.label.management.typeCondition.value')}
      </Menu.Item>
      <Menu.Item onClick={() => this.addConditionItem('statusDevice')}>
        {translate('alarm.label.management.typeCondition.device')}
      </Menu.Item>
    </Menu>
  )

  getParamAdvance = () => {
    const { form } = this.props
    const values = form.getFieldsValue()
    if (_.isEmpty(values)) return {}

    const param = Object.entries(values[FIELDS.CONDITIONS]).map(
      ([key, value]) => ({
        ...value,
        id: key,
      })
    )
    return param
  }

  render() {
    const { form, isEdit } = this.props
    const { conditions } = this.state
    const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)

    return (
      <React.Fragment>
        <ConditionWrapper>
          {conditions.map((conditionItem, index) => (
            <ConditionItem
              index={index}
              form={form}
              conditionItem={conditionItem}
              deleteConditionItem={this.deleteConditionItem}
            />
          ))}
          {!isEdit && (
            <Dropdown overlay={this.menu} placement="bottomCenter">
              <Button>
                {translate('alarm.label.management.addCondition')}
              </Button>
            </Dropdown>
          )}
        </ConditionWrapper>
        <Clearfix height={24} />
        <Row gutter={6}>
          <Col span={8}>
            <FormItem label={i18n().form.label.repeatConfig}>
              {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.active`, {
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
          </Col>
          {repeatConfig && (
            <Col span={8}>
              <FormItem label={i18n().form.label.frequency}>
                {form.getFieldDecorator(`${FIELDS.REPEAT_CONFIG}.frequency`, {
                  initialValue: 15,
                })(<SelectFrequency />)}
              </FormItem>
            </Col>
          )}
        </Row>
      </React.Fragment>
    )
  }
}

const AlarmFormWrapper = Form.create()(AdvanceForm)
export default AlarmFormWrapper
