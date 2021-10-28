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

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return {
    stationAutoById,
    stationIdSelected: state.alarm.stationIdSelected,
  }
}

const ConditionItem = connect(mapStateToProp)(
  ({ deleteConditionItem, conditionItem, form, index, ...otherProps }) => {
    const measuringList = _.get(
      otherProps.stationAutoById,
      `${otherProps.stationIdSelected}.measuringList`,
      []
    )

    const Col3 = type => {
      const Component = {
        value: () => (
          <React.Fragment>
            <FormItem label={i18n().form.label.value}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.value`
              )(<InputNumber style={{ width: '100%' }} />)}
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
        device: () => (
          <React.Fragment>
            <FormItem label={i18n().form.label.value}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.value`
              )(<SelectStatusDevice style={{ width: '100%' }} />)}
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

    const isFirstItem = index === 0

    return (
      <React.Fragment>
        {!isFirstItem && (
          <React.Fragment>
            <Row>
              <Col span={3}>
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${conditionItem.id}.clause`,
                  { initialValue: 'and' }
                )(<SelectClause style={{ width: '100%' }} />)}
              </Col>
            </Row>
            <Clearfix height={4} />
          </React.Fragment>
        )}

        <Row type="flex" justify="space-between" align="middle">
          <Col span={6}>
            <FormItem label={i18n().form.label.measure}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.measure`
              )(
                <SelectMeasureParameter
                  measuringList={measuringList}
                  mode="single"
                />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={i18n().form.label.compare}>
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${conditionItem.id}.operator`
              )(<SelectOperator />)}
            </FormItem>
          </Col>

          <Col span={6}>{Col3(conditionItem.type)}</Col>

          {!isFirstItem && (
            <Col span={3}>
              <Icon
                onClick={() => deleteConditionItem(conditionItem.id)}
                type="delete"
                style={{ color: '#DC4448', fontSize: 24 }}
              />
            </Col>
          )}

          {isFirstItem && <Col span={3} />}
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
    conditions: [
      {
        id: uuidv4(),
        type: 'value',
      },
    ],
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

  addConditionItem = value => {
    const { conditions } = this.state
    const newConditions = [...conditions, { id: uuidv4(), type: value }]
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
      <Menu.Item onClick={() => this.addConditionItem('device')}>
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
    const { form } = this.props
    const { conditions } = this.state
    const repeatConfig = form.getFieldValue(`${FIELDS.REPEAT_CONFIG}.active`)

    return (
      <React.Fragment>
        {conditions.map((conditionItem, index) => (
          <ConditionItem
            index={index}
            form={form}
            conditionItem={conditionItem}
            deleteConditionItem={this.deleteConditionItem}
          />
        ))}
        <Dropdown overlay={this.menu} placement="bottomCenter">
          <Button>{translate('alarm.label.management.addCondition')}</Button>
        </Dropdown>
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
