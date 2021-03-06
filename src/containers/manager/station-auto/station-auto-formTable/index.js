import { Button, Form, Icon, Input, Popconfirm, Row, Select, Table } from 'antd'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import InputNumberCell from '../../../../components/elements/input-number-cell'
import { langPropTypes } from '../../../../hoc/create-lang'
import { v4 as uuidv4 } from 'uuid'

const FormItem = Form.Item

function i18n() {
  return {
    sensorRange: translate('stationAutoManager.form.range.label'),
    sensorRangeMin: translate(
      'stationAutoManager.form.measuringMinRange.label'
    ),
    sensorRangeMax: translate(
      'stationAutoManager.form.measuringMaxRange.label'
    ),
    tendToExceed: translate('stationAutoManager.form.tendToExceed.label'),
    tendToExceedMin: translate(
      'stationAutoManager.form.measuringMinLimit.label'
    ),
    tendToExceedMax: translate(
      'stationAutoManager.form.measuringMaxLimit.label'
    ),
    qcvn: translate('stationAutoManager.form.qcvn.label'),
    qcvnMin: translate('stationAutoManager.form.measuringMinLimit.label'),
    qcvnMax: translate('stationAutoManager.form.measuringMaxLimit.label'),
    unit: translate('stationAutoManager.form.measuringUnit.label'),
  }
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
    const {
      dataSource,
      isStandardsVN,
      onChangeMeasuring,
      onChangeStandardsVN,
    } = this.props
    let measuringList = []

    measuringList = _.map(dataSource, (item, index) => {
      return {
        ...item,
      }
    })
    if (isStandardsVN) {
      // console.log(this.props.standardsVN, '---standardsVN--')

      measuringList = this.updateMinMaxOfMeasuring(measuringList)
      // this.setState({
      //   isLoaded: false,
      // })
      // console.log(measuringList, '---componentDidUpdate--2')
      if (onChangeMeasuring) {
        this.setState({
          measuringList: measuringList,
          // isLoaded: true,
        })
        // this.props.onChangeMeasuring(measuringList)
      }
      if (onChangeStandardsVN) {
        onChangeStandardsVN(false)
      }
    }

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
        maxLimit: itemQCVN ? itemQCVN.maxLimit : item.maxLimit,
        minLimit: itemQCVN ? itemQCVN.minLimit : item.minLimit,
      }
    })
    return measuringList
  }

  isDisableDeleteButton = keyMeasure => {
    const { measuringListAdvanced } = this.props
    let measuringSelected
    if (measuringListAdvanced) {
      measuringListAdvanced.forEach(element => {
        if (element.key === keyMeasure) measuringSelected = element
      })
      return measuringListAdvanced.includes(measuringSelected)
    }
    return false
  }

  getColumns = () => {
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form

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
            {getFieldDecorator(`measuringList.${record.id}.name`, {
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
                onChange={value =>
                  this.handleChangeMeasuring(value, record, index)
                }
                options={this.state.measuringOptions}
                // autoFocus={true}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: i18n().qcvn,
        children: [
          {
            dataIndex: 'minLimit',
            align: 'center',
            title: i18n().qcvnMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'minLimit'),
          },
          {
            dataIndex: 'maxLimit',
            align: 'center',
            title: i18n().qcvnMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCell(text, record, index, 'maxLimit'),
          },
        ],
      },
      {
        title: i18n().tendToExceed,
        children: [
          {
            dataIndex: 'minTend',
            align: 'center',
            title: i18n().tendToExceedMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'minTend'),
          },
          {
            dataIndex: 'maxTend',
            align: 'center',
            title: i18n().tendToExceedMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'maxTend'),
          },
        ],
      },
      {
        title: i18n().sensorRange,
        children: [
          {
            dataIndex: 'minRange',
            align: 'center',
            title: i18n().sensorRangeMin,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'minRange'),
          },
          {
            dataIndex: 'maxRange',
            align: 'center',
            title: i18n().sensorRangeMax,
            width: 150,
            render: (text, record, index) =>
              this.renderItemNumberCellNoQaQc(text, record, index, 'maxRange'),
          },
        ],
      },
      {
        dataIndex: 'unit',
        title: i18n().unit,
        align: 'center',
        width: 150,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringList.${record.id}.unit`, {
              initialValue: text,
              rule: {
                whitespace: true,
              },
            })(
              <Input
                onChange={e =>
                  this.handleOnChangeUnit(e.target.value, record, index)
                }
                style={{ width: 120 }}
              />
            )}
          </FormItem>
        ),
      },
      {
        // dataIndex: 'name',
        title: '', //Action
        width: 50,
        render: (text, record, index) => {
          const { form } = this.props
          const { measuringList } = this.state
          const total = measuringList ? measuringList.length : 0
          return (
            <div
              style={{
                textAlign: 'center',
              }}
              className="editable-row-operations"
            >
              {index > -1 && total !== 1 && (
                <span>
                  <Popconfirm
                    title={t('stationAutoManager.delete.require')}
                    onConfirm={() => this.removeMeasuring(record.id)}
                    disabled={this.isDisableDeleteButton(
                      form.getFieldValue(`measuringList.${record.id}.key`)
                    )}
                  >
                    <Button
                      disabled={this.isDisableDeleteButton(
                        form.getFieldValue(`measuringList.${record.id}.key`)
                      )}
                      type="link"
                    >
                      <Icon
                        type="delete"
                        style={{
                          marginLeft: '5px',
                          color: this.isDisableDeleteButton(
                            form.getFieldValue(`measuringList.${record.id}.key`)
                          )
                            ? '#A2A7B3'
                            : 'red',
                        }}
                      />
                    </Button>
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
      id: uuidv4(),
      key: '',
      name: '',
      unit: '',
    }
    let rows = this.state.measuringList.slice()
    rows = update(rows, { $push: [newRow] })
    this.setState({ measuringList: rows })
    this.setState({
      measuringOptions: this.getOptions(this.state.measuringList),
    })
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

  removeMeasuring(id) {
    const { measuringList } = this.state
    const { measuringListSource, onChangeMeasuring } = this.props
    const newMeasuringList = measuringList.filter(item => item.id !== id)
    this.setState(
      {
        measuringList: newMeasuringList,
        measuringOptions: this.getOptions(newMeasuringList),
      },
      () => {
        const measuringListSourceAdvanced = measuringListSource.filter(
          measure =>
            newMeasuringList.some(measuring => measuring.key === measure.key)
        )

        onChangeMeasuring(
          measuringList,
          this.props.measuringListAdvanced,
          measuringListSourceAdvanced
        )
      }
    )
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
      return true
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
        {this.props.form.getFieldDecorator(
          `measuringList.${record.id}.${key}`,
          {
            initialValue: text,
          }
        )(<span>{text}</span>)}
      </FormItem>
    )
  }

  renderItemNumberCell = (text, record, index, field) => {
    // if (!this.props.isEdit) {
    //   text = this.getValueStandardVN(record, field)
    // }
    return (
      <FormItem style={{ marginBottom: 0 }}>
        {this.props.form.getFieldDecorator(
          `measuringList.${record.id}.${field}`,
          {
            initialValue: text,
            // validateFirst: true,
            // rules: [
            //   { validator: (rule, value, callback) => this.validateValue(index, rule, value, callback) },
            // ]
          }
        )(
          <InputNumberCell
            onChange={value =>
              this.handleOnChangeNumberCell(value, record, field)
            }
            style={{ width: 120 }}
            editable={this._isEnableEditMeasure(record.key)}
          />
        )}
      </FormItem>
    )
  }

  // NOTE ko check logic disable cac field
  renderItemNumberCellNoQaQc = (text, record, index, field) => {
    return (
      <FormItem style={{ marginBottom: 0 }}>
        {this.props.form.getFieldDecorator(
          `measuringList.${record.id}.${field}`,
          {
            initialValue: text,
            // validateFirst: true,
            // rules: [
            //   { validator: (rule, value, callback) => this.validateValue(index, rule, value, callback) },
            // ]
          }
        )(
          <InputNumberCell
            onChange={value =>
              this.handleOnChangeNumberCellNoQaQc(value, record, field)
            }
            style={{ width: 120 }}
            editable={true}
          />
        )}
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
    const { measuringList, isLoaded } = this.state

    return (
      <div>
        {isLoaded && (
          <Table
            bordered
            rowKey={record => record.id}
            dataSource={measuringList}
            columns={this.getColumns()}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
            footer={() => (
              <Row type="flex" style={{ color: '#1890FF' }} align="middle">
                <Button
                  type="link"
                  style={{ fontWeight: 500, fontSize: '14px' }}
                  onClick={this.handleAddRow}
                >
                  <Icon type="plus" />
                  {translate('stationAutoManager.addMeasuring.label')}
                </Button>
              </Row>
            )}
          />
        )}
      </div>
    )
  }

  handleOnChangeNumberCell = (value, record, field) => {
    const { measuringList } = this.state

    let newMeasuringList = [...measuringList]
    newMeasuringList.forEach(measuring => {
      if (measuring.id === record.id) {
        measuring[field] = value
      }
    })

    this.setState({ measuringList: newMeasuringList })
  }

  handleOnChangeNumberCellNoQaQc = (value, record, field) => {
    const { measuringList } = this.state

    let newMeasuringList = [...measuringList]
    newMeasuringList.forEach(measuring => {
      if (measuring.id === record.id) {
        measuring[field] = value
      }
    })

    this.setState({ measuringList: newMeasuringList })
  }

  handleChangeMeasuring = (value, record, index) => {
    const { measuringListSource } = this.props
    const { measuringList } = this.state
    const measure = measuringListSource.find(item => item.key === value)

    const newMeasuringList = measuringList.map(measuring => {
      return measuring.id === record.id
        ? {
            id: record.id,
            key: value,
            maxLimit: record.maxLimit,
            maxRange: record.maxRange,
            maxTend: record.maxTend,
            minLimit: record.minLimit,
            minRange: record.minRange,
            minTend: record.minTend,
            name: measure.name,
            unit: measure.unit,
          }
        : measuring
    })

    this.setState(
      {
        measuringList: newMeasuringList,
        measuringOptions: this.getOptions(newMeasuringList),
      },
      () => {
        let indexChange = []
        let measuringListAdvancedChanged

        const {
          measuringListAdvanced,
          form,
          measuringListSource,
          onChangeMeasuring,
        } = this.props
        const { measuringList } = this.state

        const measuringListSourceAdvanced = measuringListSource.filter(
          measure =>
            measuringList.some(measuring => measuring.key === measure.key)
        )

        if (measuringListAdvanced) {
          measuringListAdvancedChanged = measuringListAdvanced.filter(
            measuringAdvanced => {
              return measuringList.every(
                measuring => measuring.key !== measuringAdvanced.key
              )
            }
          )

          measuringListAdvancedChanged.forEach(value => {
            const index = measuringListAdvanced.indexOf(value)
            indexChange = [...indexChange, index]
            measuringListAdvanced[index].key = undefined
            measuringListAdvanced[index].unit = undefined
            measuringListAdvanced[index].name = undefined
            measuringListAdvanced[index].nameCalculate = undefined
          })
        }
        indexChange.forEach(index =>
          setTimeout(() => {
            form.setFieldsValue({
              [`measuringListAdvanced.${measuringListAdvanced[index].id}`]: {
                name: undefined,
                nameCalculate: undefined,
              },
            })
          })
        )

        onChangeMeasuring(
          measuringList,
          measuringListAdvanced,
          measuringListSourceAdvanced
        )
      }
    )
  }

  handleOnChangeUnit = (value, record, index) => {
    let indexOfUnitChange
    let measuringUnitChange
    if (this.props.measuringListAdvanced.length > 0) {
      measuringUnitChange = this.props.measuringListAdvanced.filter(
        measuringAdvanced =>
          measuringAdvanced.key === this.state.measuringList[index].key
      )

      this.props.measuringListAdvanced.forEach((measuringAdvanced, index) => {
        if (
          measuringUnitChange.some(value => value.key === measuringAdvanced.key)
        ) {
          indexOfUnitChange = index
        }
      })
    }
    let newMeasuringList = [...this.state.measuringList]
    newMeasuringList.forEach(measuring => {
      if (measuring.id === record.id) {
        measuring.unit = this.props.form.getFieldValue(
          `measuringList.${record.id}.unit`
        )
      }
    })

    setTimeout(() => {
      if (this.props.measuringListAdvanced[indexOfUnitChange]) {
        this.props.measuringListAdvanced[
          indexOfUnitChange
        ].unit = this.props.form.getFieldValue(
          `measuringList.${record.id}.unit`
        )
        this.props.onChangeMeasuringUnit(true)
      }
    })

    const measuringListSourceAdvanced = this.props.measuringListSource.filter(
      measure =>
        this.state.measuringList.some(
          measuring => measuring.key === measure.key
        )
    )

    this.props.onChangeMeasuring(
      this.state.measuringList,
      this.props.measuringListAdvanced,
      measuringListSourceAdvanced
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoaded, measuringList } = this.state
    const { onChangeMeasuring, form } = this.props

    if (isLoaded) {
      let measuringListForm = form.getFieldValue('measuringList')
      if (
        JSON.stringify(measuringListForm) !== JSON.stringify(measuringList) ||
        JSON.stringify(prevState.measuringList) !==
          JSON.stringify(measuringList)
      ) {
        if (onChangeMeasuring) {
          onChangeMeasuring(measuringList)
        }
      }
    }
  }
}
