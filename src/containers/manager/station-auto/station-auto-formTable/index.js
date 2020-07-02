import React from 'react'
import { Form, Button, Select, Table, Popconfirm, Icon, Input } from 'antd'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import { langPropTypes } from '../../../../hoc/create-lang'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import InputNumberCell from '../../../../components/elements/input-number-cell'
import update from 'immutability-helper'
import * as _ from 'lodash'
import { translate } from 'hoc/create-lang'

const FormItem = Form.Item

const i18n = {
  sensorRange: translate('stationAutoManager.form.range.label'),
  sensorRangeMin: translate('stationAutoManager.form.measuringMinRange.label'),
  sensorRangeMax: translate('stationAutoManager.form.measuringMaxRange.label'),
  tendToExceed: translate('stationAutoManager.form.tendToExceed.label'),
  tendToExceedMin: translate('stationAutoManager.form.measuringMinLimit.label'),
  tendToExceedMax: translate('stationAutoManager.form.measuringMaxLimit.label'),
  qcvn: translate('stationAutoManager.form.qcvn.label'),
  qcvnMin: translate('stationAutoManager.form.measuringMinLimit.label'),
  qcvnMax: translate('stationAutoManager.form.measuringMaxLimit.label'),
  unit: translate('stationAutoManager.form.measuringUnit.label'),
}

@autobind
export default class StationAutoFormTable extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    lang: langPropTypes,
    dataSource: PropTypes.array,
    measuringListSource: PropTypes.array,
    allowUpdateStandardsVN: PropTypes.bool,
    standardsVN: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      standardsVN: props.standardsVN,
      measuringList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    let params = {}

    if (!_.isEqual(nextProps.standardsVN, this.props.standardsVN)) {
      params.standardsVN = nextProps.standardsVN
      if (
        this.props.allowUpdateStandardsVN &&
        !_.isEmpty(nextProps.standardsVN)
      ) {
        let measuringList = _.filter(
          this.state.measuringList,
          item => !_.isEmpty(item.measuringKey)
        )
        let size = _.size(this.state.measuringList)
        const measureObj = _.keyBy(this.state.measuringList, 'measuringKey')
        _.forEach(_.values(nextProps.standardsVN), item => {
          if (!measureObj[item.key]) {
            measuringList = _.concat(measuringList, {
              measuringKey: item.key,
              ...item,
              key: item.key// size,
            })
            size++
          }
        })
        if (_.size(measuringList) > 0) {
          params.measuringList = measuringList
        }
      }

      this.setState(params)
    }
  }

  async componentWillMount() {
    let measuringList = []

    if (
      this.props.allowUpdateStandardsVN &&
      !_.isEmpty(this.props.standardsVN)
    ) {
      measuringList = _.map(_.values(this.props.standardsVN), (item, index) => {
        item.measuringKey = item.key
        item.key = item.key // index
        return item
      })
    } else {
      measuringList = _.map(this.props.dataSource, (item, index) => {
        item.measuringKey = item.key
        item.key = item.key // index
        return item
      })
    }

    this.setState({ measuringList })

    // this.setState({
    //   measuringList: this.props.dataSource.map((item, index) => {
    //     item.measuringKey = item.key
    //     item.key = index
    //     return item
    //   })
    // })
  }

  handleAddRow() {
    const newRow = {
      key: this.state.measuringList.length,
      name: '',
      unit: '',
    }
    let rows = this.state.measuringList.slice()
    rows = update(rows, { $push: [newRow] })
    this.setState({ measuringList: rows })
    console.log(rows)
  }

  getValueStandardVN = (record, field) => {
    // console.log(this.state.standardsVN)
    //  console.log(record)
    const value = _.get(
      _.get(this.state.standardsVN, _.get(record, 'measuringKey'), {}),
      field,
      undefined
    )
    if (!_.isUndefined(value)) {
      return value
    }
    return ''
  }

  removeMeasuring(index) {
    this.state.measuringList.splice(index, 1)
    this.forceUpdate()
  }

  handleChangeMeasuring(value, index, column) {
    const measure = this.props.measuringListSource.find(
      item => item.key === value
    )
    this.setState(
      update(this.state, {
        measuringList: {
          [index]: {
            measuringKey: { $set: value },
            unit: { $set: measure.unit },
          },
        },
      })
    )
  }

  renderItemCell = (text, record, index, key) => (
    <FormItem style={{ marginBottom: 0 }}>
      {this.props.form.getFieldDecorator(`measuringList[${index}].${key}`, {
        initialValue: text,
      })(<span>{text}</span>)}
    </FormItem>
  )

  renderItemNumberCell = (text, record, index, key, autoFill = false) => {
    if (autoFill) {
      if (!_.isNumber(text) && this.props.allowUpdateStandardsVN) {
        text = this.getValueStandardVN(record, key)
      }
    }
    return (
      <FormItem style={{ marginBottom: 0 }}>
        {this.props.form.getFieldDecorator(`measuringList[${index}].${key}`, {
          initialValue: text,
          // validateFirst: true,
          // rules: [
          //   { validator: (rule, value, callback) => this.validateValue(index, rule, value, callback) },
          // ]
        })(<InputNumberCell style={{ width: 120 }} editable={true} />)}
      </FormItem>
    )
  }

  validateValue = (indexOfRow, rule, value, callback) => {
    const { form } = this.props

    const nameOfInputChanged = rule.field.split('.')[1]
    let rowData = form.getFieldsValue().measuringList[indexOfRow]
    let arrLongName = [
      'min Range',
      'min Limit',
      'min Tend',
      'max Tend',
      'max Limit',
      'max Range',
    ]
    let arrName = [
      'minRange',
      'minLimit',
      'minTend',
      'maxTend',
      'maxLimit',
      'maxRange',
    ]
    let lengthOfArrName = arrName.length

    /* Dùng thuật toán two pointer */

    let indexOfNameChanged = arrName.indexOf(nameOfInputChanged)
    let nameOfIndex = arrName[indexOfNameChanged]
    let longNameOfIndex = arrLongName[indexOfNameChanged]
    let valueOfNameChanged = rowData[nameOfIndex]

    let indexOfLeftPointer = indexOfNameChanged
    let nameOfLeftPointer = nameOfIndex
    let longNameOfLeftPointer = longNameOfIndex
    let valueOfLeftPointer = valueOfNameChanged

    let indexOfRightPointer = indexOfNameChanged
    let nameOfRightPointer = nameOfIndex
    let longNameOfRightPointer = longNameOfIndex
    let valueOfRightPointer = valueOfNameChanged

    while (true) {
      if (!valueOfNameChanged) break

      if (valueOfNameChanged < valueOfLeftPointer) {
        return callback(`field < ${longNameOfLeftPointer}`)
      }

      if (valueOfNameChanged > valueOfRightPointer) {
        return callback(`field > ${longNameOfRightPointer}`)
      }

      if (
        indexOfLeftPointer === 0 &&
        indexOfRightPointer === lengthOfArrName - 1
      ) {
        callback()
        break
      }

      if (indexOfLeftPointer > 0) {
        indexOfLeftPointer = indexOfLeftPointer - 1
        nameOfLeftPointer = arrName[indexOfLeftPointer]
        longNameOfLeftPointer = arrLongName[indexOfLeftPointer]
        valueOfLeftPointer = rowData[nameOfLeftPointer]
      }

      if (indexOfRightPointer < lengthOfArrName - 1) {
        indexOfRightPointer = indexOfRightPointer + 1
        nameOfRightPointer = arrName[indexOfRightPointer]
        longNameOfRightPointer = arrLongName[indexOfRightPointer]
        valueOfRightPointer = rowData[nameOfRightPointer]
      }
    }
    callback()
  }

  getColumns = () => {
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form

    return [
      {
        dataIndex: 'measuringKey',
        align: 'center',
        title: t('stationAutoManager.form.measuringKey.label'),
        width: 130,
        render: (text, record, index) =>
          this.renderItemCell(text, record, index, 'key'),
      },
      {
        dataIndex: 'measuringName',
        align: 'center',
        title: t('stationAutoManager.form.measuringName.label'),
        width: 130,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringList[${index}].name`, {
              initialValue: record.name,
              rules: [
                {
                  required: true,
                  message:
                    'Please select ' +
                    t('stationAutoManager.form.measuringName.label'),
                },
              ],
            })(
              <AutoCompleteCell
                style={{ width: 120 }}
                editable={true}
                onChange={value =>
                  this.handleChangeMeasuring(value, index, 'name')
                }
                options={_.get(this.props, 'measuringListSource', []).map(d => (
                  <Select.Option key={d.key} value={d.key}>
                    {d.name}
                  </Select.Option>
                ))}
                // autoFocus={true}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: i18n.qcvn,
        children: [
          {
            dataIndex: 'minLimit',
            align: 'center',
            title: i18n.qcvnMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'minLimit', true),
          },
          {
            dataIndex: 'maxLimit',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'maxLimit', true),
          },
        ],
      },
      {
        title: i18n.tendToExceed,
        children: [
          {
            dataIndex: 'minTend',
            align: 'center',
            title: i18n.tendToExceedMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'minTend', true),
          },
          {
            dataIndex: 'maxTend',
            align: 'center',
            title: i18n.tendToExceedMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'maxTend', true),
          },
        ],
      },
      {
        title: i18n.sensorRange,
        children: [
          {
            dataIndex: 'minRange',
            align: 'center',
            title: i18n.sensorRangeMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'minRange'),
          },
          {
            dataIndex: 'maxRange',
            align: 'center',
            title: i18n.sensorRangeMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'maxRange'),
          },
        ],
      },
      {
        dataIndex: 'unit',
        title: i18n.unit,
        align: 'center',
        width: 150,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringList[${index}].unit`, {
              initialValue: text,
            })(<Input style={{ width: 120 }} />)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'name',
        title: '', //Action
        width: 50,
        render: (text, record, index) => {
          return (
            <div className="editable-row-operations">
              {index !== -1 && (
                <span>
                  <Popconfirm
                    title={t('stationAutoManager.delete.require')}
                    onConfirm={() => this.removeMeasuring(index)}
                  >
                    <a>
                      <Icon
                        type="delete"
                        style={{ marginLeft: '5px', color: 'red' }}
                      />
                    </a>
                  </Popconfirm>
                </span>
              )}
            </div>
          )
        },
      },
    ]
  }

  render() {
    const { t } = this.props.lang
    console.log('measuringList', this.state.measuringList)
    return (
      <div>
        <Button
          style={{ right: '0', marginBottom: '16px' }}
          type="primary"
          onClick={this.handleAddRow}
        >
          {t('stationAutoManager.addMeasuring.label')}
        </Button>
        <Table
          bordered
          dataSource={this.state.measuringList}
          columns={this.getColumns()}
          pagination={{
            pageSize: 1000,
            hideOnSinglePage: true,
          }}
        />
      </div>
    )
  }
}
