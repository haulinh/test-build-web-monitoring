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
    standardsVN: PropTypes.array,
    isEdit: PropTypes.bool, // giữ lại các chỉ tiêu đã có truoc
    onChangeMeasuring: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringList: [],
      isLoaded: false,
      measuringOptions: [],
    }
  }

  async componentDidMount() {
    let measuringList = []

    measuringList = _.map(this.props.dataSource, (item, index) => {
      return {
        ...item,
        id: index + 1,
      }
    })

    // console.log('--componentDidMount--', this.props.dataSource)
    this.setState({
      isLoaded: true,
      measuringList: measuringList,
      measuringOptions: this.getOptions(measuringList),
    })
  }

  getOptions(measuringList) {
    const data = _.get(this.props, 'measuringListSource', []).map(d => (
      <Select.Option
        disabled={!this._isEnableSelectMeasure(d.key, measuringList)}
        key={d.key}
        value={d.key}
      >
        {d.name}
      </Select.Option>
    ))
    return data
  }

  updateMinMaxOfMeasuring = dataSource => {
    const measuringList = _.map(dataSource, (item, index) => {
      let itemQCVN = this.props.standardsVN.find(obj => obj.key === item.key)

      return {
        ...item,
        id: index + 1,
        maxLimit: itemQCVN ? itemQCVN.maxLimit : item.maxLimit,
        minLimit: itemQCVN ? itemQCVN.minLimit : item.minLimit,
      }
    })
    return measuringList
  }

  getColumns = () => {
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form
    // console.log("---getColumns--")

    return [
      {
        dataIndex: 'key',
        align: 'center',
        title: t('stationAutoManager.form.measuringKey.label'),
        width: 130,
        render: (text, record, index) =>
          this.renderItemCell(text, record, index, 'key'),
      },
      {
        dataIndex: 'name',
        align: 'center',
        title: t('stationAutoManager.form.measuringName.label'),
        width: 130,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringList[${index}].name`, {
              initialValue: record.name,
              // rules: [
              //   {
              //     required: true,
              //     message:
              //       'Please select ' +
              //       t('stationAutoManager.form.measuringName.label'),
              //   },
              // ],
            })(
              <AutoCompleteCell
                style={{ width: 120 }}
                editable={this._isEnableEditMeasure(record.key)}
                onChange={value => this.handleChangeMeasuring(value, index)}
                options={this.state.measuringOptions}
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
              this.renderItemNumberCell(text, record, index, 'minLimit'),
          },
          {
            dataIndex: 'maxLimit',
            align: 'center',
            title: i18n.qcvnMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'maxLimit'),
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
              this.renderItemNumberCellNoQaQc(text, record, index, 'minTend'),
          },
          {
            dataIndex: 'maxTend',
            align: 'center',
            title: i18n.tendToExceedMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'maxTend'),
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
              this.renderItemNumberCellNoQaQc(text, record, index, 'minRange'),
          },
          {
            dataIndex: 'maxRange',
            align: 'center',
            title: i18n.sensorRangeMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'maxRange'),
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
        // dataIndex: 'name',
        title: '', //Action
        width: 50,
        render: (text, record, index) => {
          return (
            <div
              style={{
                textAlign: 'center',
              }}
              className="editable-row-operations"
            >
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

  handleAddRow() {
    const newRow = {
      id: this.state.measuringList.length + 1,
      key: '',
      name: '',
      unit: '',
    }
    let rows = this.state.measuringList.slice()
    rows = update(rows, { $push: [newRow] })
    this.setState({ measuringList: rows })
  }

  getValueStandardVN = (record, field) => {
    // console.log(this.state.standardsVN)
    //  console.log(record)
    const value = _.get(
      _.get(this.props.standardsVN, _.get(record, 'measuringKey'), {}),
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

  _isEnableEditMeasure = meaKey => {
    const listKey = this.props.standardsVN.map(item => item.key)
    if (_.includes(listKey, meaKey)) {
      return false
    }
    return true
  }

  _isEnableSelectMeasure = (meaKey, measuringList) => {
    const arr = measuringList
    // console.log(arr, '---arr--')
    if (!arr || arr.length < 1) {
      return false
    }

    const index = _.findIndex(arr, i => {
      return i.key === meaKey
    })
    // console.log(arr, index, '-----')
    if (index > -1) {
      return false
    }

    return true
  }

  renderItemCell = (text, record, index, key) => {
    return (
      <FormItem style={{ marginBottom: 0 }}>
        {this.props.form.getFieldDecorator(`measuringList[${index}].${key}`, {
          initialValue: text,
        })(<span>{text}</span>)}
      </FormItem>
    )
  }

  renderItemNumberCell = (text, record, index, field) => {
    // if (!this.props.isEdit) {
    //   text = this.getValueStandardVN(record, field)
    // }
    return (
      <FormItem style={{ marginBottom: 0 }}>
        {this.props.form.getFieldDecorator(`measuringList[${index}].${field}`, {
          initialValue: text,
          // validateFirst: true,
          // rules: [
          //   { validator: (rule, value, callback) => this.validateValue(index, rule, value, callback) },
          // ]
        })(
          <InputNumberCell
            style={{ width: 120 }}
            editable={this._isEnableEditMeasure(record.key)}
          />
        )}
      </FormItem>
    )
  }

  // NOTE ko check logic disable cac field
  renderItemNumberCellNoQaQc = (text, record, index, key) => {
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

  render() {
    const { t } = this.props.lang
    // const { getFieldValue } = this.props.form

    // console.log('---form---', getFieldValue('measuringList'))
    // console.log('---form-measuringList--', this.state.measuringList)
    return (
      <div>
        <Button
          style={{ right: '0', marginBottom: '16px' }}
          type="primary"
          onClick={this.handleAddRow}
        >
          {t('stationAutoManager.addMeasuring.label')}
        </Button>
        {this.state.isLoaded && (
          <Table
            bordered
            rowKey="id"
            dataSource={this.state.measuringList}
            columns={this.getColumns()}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
          />
        )}
      </div>
    )
  }

  handleChangeMeasuring = (value, index) => {
    const measure = this.props.measuringListSource.find(
      item => item.key === value
    )

    let itemQCVN = this.props.standardsVN.find(item => item.key === value)

    this.setState(
      update(this.state, {
        measuringList: {
          [index]: {
            key: { $set: value },
            name: { $set: measure.name },
            unit: { $set: measure.unit },
            maxLimit: { $set: itemQCVN ? itemQCVN.maxLimit : null },
            minLimit: { $set: itemQCVN ? itemQCVN.minLimit : null },
          },
        },
      })
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isLoaded &&
      JSON.stringify(prevProps.standardsVN) !==
        JSON.stringify(this.props.standardsVN)
    ) {
      // console.log(this.props.standardsVN, '---standardsVN--')
      const { getFieldValue } = this.props.form
      this.setState({
        isLoaded: false,
      })
      const measuringList = this.updateMinMaxOfMeasuring(
        getFieldValue('measuringList')
      )

      // console.log( getFieldValue('measuringList'), "--componentDidUpdate--1")
      // console.log(measuringList, '---componentDidUpdate--2')
      this.setState({
        measuringList: measuringList,
        isLoaded: true,
      })
    }

    if (this.state.isLoaded) {
      let A = this.props.form.getFieldValue('measuringList')
      // const B = prevProps.form.getFieldValue('measuringList')

      // console.log('--1-',  A)
      // console.log('-2--',  this.state.measuringList)
      // console.log('-3--',  prevState.measuringList)
      if (
        JSON.stringify(A) !== JSON.stringify(this.state.measuringList) ||
        JSON.stringify(prevState.measuringList) !==
          JSON.stringify(this.state.measuringList)
      ) {
        console.log('Đã cập nhật', A)
        if (this.props.onChangeMeasuring) {
          this.setState({
            measuringList: A,
          })
          this.props.onChangeMeasuring(A)
        }
      }
    }
  }
}
