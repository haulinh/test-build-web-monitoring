import { Checkbox, Form, Icon, InputNumber, Table, Tooltip } from 'antd'
import { FormItem } from 'components/layouts/styles'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

function i18n() {
  return {
    zero: translate('qaqcConfig.zero'),
    negative: translate('qaqcConfig.negative'),
    repeat: translate('qaqcConfig.basic.repeat'),
    measure: translate('aqiConfigCalculation.colMeasure'),
    tooltipRepeat: translate('qaqcConfig.basic.tooltipRepeat'),
  }
}

const OPTION = {
  ZERO: 'zero',
  NEGATIVE: 'negative',
}

class TableConfig extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    dataTableMeasures: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
  }

  state = {
    zeroIsIndeterminate: false,
    zeroIsCheckAll: false,

    negativeIsIndeterminate: false,
    negativeIsCheckAll: false,
  }

  componentDidMount() {
    const { form, data, type } = this.props
    form.setFieldsValue({ [type]: data })
    this.handleCheckedAllInit()
  }

  handleCheckedAllInit() {
    let tamp = _.result(this.props.form.getFieldsValue(), this.props.type, {})

    let resZero = this.tinhToanChecked(OPTION.ZERO, tamp)
    let resNega = this.tinhToanChecked(OPTION.NEGATIVE, tamp)

    this.setState({
      zeroIsIndeterminate: resZero.isIndeterminate,
      zeroIsCheckAll: resZero.isCheckedAll,

      negativeIsIndeterminate: resNega.isIndeterminate,
      negativeIsCheckAll: resNega.isCheckedAll,
    })
  }

  componentWillReceiveProps() {
    this.handleCheckedAllInit()
  }

  validateRepeatField = (rule, value, callback) => {
    if (value !== undefined && value !== '' && Number(value) <= 1) {
      callback(translate('qaqcConfig.basic.error.repeat'))
      return
    }
    callback()
  }

  columns = [
    {
      title: i18n().measure,
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: () => {
        return (
          <Checkbox
            indeterminate={this.state.zeroIsIndeterminate}
            checked={this.state.zeroIsCheckAll}
            onClick={e => {
              this.checkAllOption(OPTION.ZERO, e.target.checked)
            }}
          >
            {i18n().zero}
          </Checkbox>
        )
      },
      dataIndex: 'zero',
      key: 'zero',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <span>
            {getFieldDecorator(`${this.props.type}.${record.key}.zero`, {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Checkbox
                onChange={e => {
                  let tamp = _.result(
                    this.props.form.getFieldsValue(),
                    this.props.type,
                    {}
                  )
                  tamp[record.key][OPTION.ZERO] = e.target.checked

                  let res = this.tinhToanChecked(OPTION.ZERO, tamp)
                  this.setState({
                    zeroIsIndeterminate: res.isIndeterminate,
                    zeroIsCheckAll: res.isCheckedAll,
                  })
                }}
              />
            )}
          </span>
        )
      },
    },
    {
      title: () => {
        return (
          <Checkbox
            indeterminate={this.state.negativeIsIndeterminate}
            checked={this.state.negativeIsCheckAll}
            onClick={e => {
              this.checkAllOption(OPTION.NEGATIVE, e.target.checked)
            }}
          >
            {i18n().negative}
          </Checkbox>
        )
      },
      dataIndex: 'negative',
      key: 'negative',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form

        return (
          <span>
            {getFieldDecorator(`${this.props.type}.${record.key}.negative`, {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <Checkbox
                onChange={e => {
                  let tamp = _.result(
                    this.props.form.getFieldsValue(),
                    this.props.type,
                    {}
                  )
                  tamp[record.key][OPTION.NEGATIVE] = e.target.checked

                  let res = this.tinhToanChecked(OPTION.NEGATIVE, tamp)
                  this.setState({
                    negativeIsIndeterminate: res.isIndeterminate,
                    negativeIsCheckAll: res.isCheckedAll,
                  })
                }}
              />
            )}
          </span>
        )
      },
    },
    {
      title: (
        <div>
          {i18n().repeat}
          <Tooltip title={i18n().tooltipRepeat}>
            <Icon
              type="exclamation-circle"
              theme="filled"
              style={{ marginLeft: 12, color: '#A2A7B3' }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'repeat',
      key: 'repeat',
      width: 180,
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        const { type } = this.props

        const repeatFieldName = `${type}.${record.key}.repeat`

        return (
          <React.Fragment>
            <FormItem marginBottom="0px">
              {getFieldDecorator(repeatFieldName, {
                trigger: 'onBlur',
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    validator: this.validateRepeatField,
                  },
                ],
              })(
                <InputNumber
                  placeholder={translate('qaqcConfig.basic.placeholderRepeat')}
                  pattern="[0-9]*"
                  style={{ width: '100%' }}
                  onKeyDown={e => {
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              )}
            </FormItem>
          </React.Fragment>
        )
      },
    },
  ]

  checkAllOption(option, isChecked) {
    let tamp = _.result(this.props.form.getFieldsValue(), this.props.type, {})
    _.mapKeys(tamp, function(value, key) {
      tamp[key][option] = isChecked
    })

    this.props.form.setFieldsValue({
      [this.props.type]: tamp,
    })

    switch (option) {
      case OPTION.ZERO: {
        this.setState({
          zeroIsIndeterminate: false,
          zeroIsCheckAll: isChecked,
        })
        break
      }

      case OPTION.NEGATIVE: {
        this.setState({
          negativeIsIndeterminate: false,
          negativeIsCheckAll: isChecked,
        })
        break
      }

      default:
        break
    }
  }

  tinhToanChecked(option, dataCompare) {
    let isIndeterminate = false
    let isCheckedAll = false

    let countIsChecked = 0

    _.mapKeys(dataCompare, function(value, key) {
      if (value[option]) countIsChecked++
    })
    if (countIsChecked > 0 && countIsChecked < Object.keys(dataCompare).length)
      isIndeterminate = true
    if (
      countIsChecked === Object.keys(dataCompare).length &&
      Object.keys(dataCompare).length !== 0
    )
      isCheckedAll = true

    return {
      isIndeterminate,
      isCheckedAll,
    }
  }

  render() {
    const { dataTableMeasures } = this.props

    return (
      <div>
        <Table
          bordered
          pagination={false}
          columns={this.columns}
          dataSource={dataTableMeasures}
        />
      </div>
    )
  }
}

const TableConfigForm = Form.create()(TableConfig)
export default TableConfigForm
