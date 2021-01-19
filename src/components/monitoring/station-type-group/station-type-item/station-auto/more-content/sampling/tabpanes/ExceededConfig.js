import React, { Component } from 'react'
import { InputNumber, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Checkbox, Form } from 'antd'
import Text from 'components/elements/text'
import { get, isEmpty } from 'lodash'
import { requiredFieldRule } from 'utils/rules'

const i18n = {
  table: {
    parameter: t('monitoring.exceeded.table.parameter'),
    active: t('monitoring.exceeded.table.active'),
    operator: t('monitoring.exceeded.table.operator'),
    value: t('monitoring.exceeded.table.value'),
    standrandValue: t('monitoring.exceeded.table.standrandValue'),
    greaterThan: t('monitoring.exceeded.table.greaterThan'),
    lessThan: t('monitoring.exceeded.table.lessThan'),
    notSetup: t('monitoring.exceeded.table.notSetup'),
    invalidValue: t('monitoring.exceeded.table.invalidValue'),
    requiredInput: t('monitoring.exceeded.table.requiredInput'),
  },
  numRecord: t('monitoring.exceeded.numRecord'),
  numRecordExceed: t('monitoring.exceeded.numRecordExceed'),
}

const TableCustom = styled(Table)`
  td {
    padding: 0 !important;
    transition: none;
  }
`

const TDDivider = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .ant-form-item {
      margin: 0;
      .ant-form-item-control {
        line-height: unset;
      }
    }
    &:first-child {
      border-bottom: 1px solid #e8e8e8;
    }
    &.checkboxWrapper {
      justify-content: center;
      input {
        cursor: pointer;
      }
      label {
        margin-bottom: 0;
      }
    }
  }
  .ant-input-number {
    width: 180px;
  }
`

class InputNumberCustom extends Component {
  timeOut = null

  onInputChange = value => {
    const { onChange } = this.props
    clearTimeout(this.timeOut)
    this.timeOut = setTimeout(() => {
      onChange(value)
    }, 300)
  }

  render() {
    return (
      <InputNumber onChange={this.onInputChange} value={this.props.value} />
    )
  }
}

class ExceededConfig extends Component {
  static propTypes = {
    measuringList: PropTypes.array,
  }

  getExceededConfigForm = () => this.props.form

  renderInput = (item, type) => {
    const { form, defaultValue } = this.props
    const field = `config[${item.key}][${type}][value]`
    const fieldCheckBox = `config[${item.key}][${type}][active]`

    const valueCheckBox = this.props.form.getFieldValue(fieldCheckBox)

    const validateMeasuring = (_, value, callback) => {
      const config = form.getFieldsValue().config[item.key]

      if (valueCheckBox && !config[type].value) {
        callback(i18n.table.requiredInput)
      }

      if (value && isNaN(+value)) {
        callback(i18n.table.invalidValue)
        return
      }

      const min = type === 'min' ? value : config['min'].value
      const max = type === 'max' ? value : config['max'].value

      if (min && max && min >= max) {
        callback(i18n.table.invalidValue)
        return
      }

      if ([min, max].includes(0)) {
        if (min >= max) callback(i18n.table.invalidValue)
      }
      callback()
    }

    const getDefaultValue = () => {
      if (isEmpty(defaultValue)) return item[`${type}Limit`]
      return get(defaultValue, field)
    }

    return (
      <div>
        <Form.Item>
          {form.getFieldDecorator(field, {
            rules: [{ validator: validateMeasuring }],
            initialValue: getDefaultValue(),
          })(<InputNumberCustom />)}
        </Form.Item>
      </div>
    )
  }

  renderCheckbox = (item, type) => {
    const { form, defaultValue } = this.props
    const field = `config[${item.key}][${type}][active]`

    return (
      <div className="checkboxWrapper">
        <Form.Item>
          {form.getFieldDecorator(field, {
            valuePropName: 'checked',
            initialValue: get(defaultValue, field),
          })(<Checkbox />)}
        </Form.Item>
      </div>
    )
  }

  getColumns = () => {
    return [
      {
        key: 'key',
        title: i18n.table.parameter,
        dataIndex: 'name',
        render: name => <Text margin="0 10px">{name}</Text>,
      },
      {
        key: 'active',
        title: i18n.table.active,
        render: item => (
          <TDDivider>
            {this.renderCheckbox(item, 'min')}
            {this.renderCheckbox(item, 'max')}
          </TDDivider>
        ),
      },
      {
        key: 'operator',
        title: i18n.table.operator,
        render: () => (
          <TDDivider>
            <div>{i18n.table.lessThan}</div>
            <div>{i18n.table.greaterThan}</div>
          </TDDivider>
        ),
      },
      {
        key: 'value',
        title: i18n.table.value,
        width: 200,
        render: (_, item) => (
          <TDDivider>
            {this.renderInput(item, 'min')}
            {this.renderInput(item, 'max')}
          </TDDivider>
        ),
      },
      {
        key: 'standrandValue',
        title: i18n.table.standrandValue,
        render: item => (
          <TDDivider>
            <div>{item.minLimit ? item.minLimit : i18n.table.notSetup}</div>
            <div>{item.maxLimit ? item.maxLimit : i18n.table.notSetup}</div>
          </TDDivider>
        ),
      },
    ]
  }

  render() {
    const { defaultValue, measuringList, form } = this.props
    return (
      <div>
        <Form.Item
          label={i18n.numRecordExceed}
          labelCol={{ span: 9 }}
          labelAlign="left"
          wrapperCol={{ span: 10 }}
        >
          {form.getFieldDecorator('numConsecutiveRecordExceed', {
            initialValue: defaultValue.numConsecutiveRecordExceed || 3,
            rules: [requiredFieldRule(i18n.numRecord)],
          })(<InputNumber />)}
        </Form.Item>
        <TableCustom
          bordered
          rowKey="key"
          pagination={false}
          columns={this.getColumns()}
          dataSource={measuringList}
        />
      </div>
    )
  }
}

export default Form.create()(ExceededConfig)
