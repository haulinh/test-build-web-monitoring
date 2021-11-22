import React from 'react'
import { Table, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'

function i18n() {
  return {
    zero: translate('qaqcConfig.zero'),
    negative: translate('qaqcConfig.negative'),
  }
}

const OPTION = {
  ZERO: 'zero',
  NEGATIVE: 'negative',
}

export default class TableConfig extends React.Component {
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
    if (this.props.getRef) this.props.getRef(this)
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

  getRef() {
    return this
  }

  columns = [
    {
      title: 'Measure',
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

  getTableData() {
    let me = this
    return new Promise(function(resolve, reject) {
      me.props.form.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values);
          resolve(values)
        }
        resolve(values)
      })
    })
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.columns}
          dataSource={this.props.dataTableMeasures}
        />
      </div>
    )
  }
}
