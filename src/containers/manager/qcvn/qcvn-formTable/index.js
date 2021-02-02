import React from 'react'
import { Form, Button, Select, Table, Popconfirm, Icon, Input } from 'antd'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import { langPropTypes } from '../../../../hoc/create-lang'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import InputNumberCell from '../../../../components/elements/input-number-cell'
import update from 'immutability-helper'
import { translate } from 'hoc/create-lang'
import { isNumber } from 'lodash'

const FormItem = Form.Item
const i18n = {
  compareToMax: translate('aqiConfigCalculation.compareToMax'),
  compareToMin: translate('aqiConfigCalculation.compareToMin'),
}
@autobind
export default class QCVNFormTable extends React.PureComponent {
  static propTypes = {
    form: PropTypes.object,
    lang: langPropTypes,
    dataSource: PropTypes.array,
    measuringListSource: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {}
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form
    this.columns = [
      {
        dataIndex: 'measuringKey',
        title: t('stationAutoManager.form.measuringKey.label'),
        width: 140,
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator(`measuringList[${index}].key`, {
              initialValue: text,
            })(<span>{text}</span>)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'measuringName',
        title: t('stationAutoManager.form.measuringName.label'),
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator(`measuringList[${index}].name`, {
              initialValue: record.name,
              rules: [
                {
                  required: true,
                  message: t('stationAutoManager.form.measuringName.error'),
                },
              ],
            })(
              <AutoCompleteCell
                placeholder={t(
                  'stationAutoManager.form.measuringName.placeholder'
                )}
                editable
                autoFocus
                onChange={value =>
                  this.handleChangeMeasuring(value, index, 'name')
                }
                options={this.props.measuringListSource.map(d => (
                  <Select.Option
                    key={d.key}
                    value={d.key}
                    disabled={this.getDisableSelect(d.key)}
                  >
                    {d.name}
                  </Select.Option>
                ))}
              />
            )}
          </FormItem>
        ),
      },
      {
        dataIndex: 'minLimit',
        title: t('stationAutoManager.form.measuringMinLimit.label'),
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator(`measuringList[${index}].minLimit`, {
              initialValue: text,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    this.compareToMax(
                      rule,
                      value,
                      callback,
                      `measuringList[${index}].maxLimit`
                    )
                  },
                },
              ],
            })(<InputNumberCell editable={true} />)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'maxLimit',
        title: t('stationAutoManager.form.measuringMaxLimit.label'),
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator(`measuringList[${index}].maxLimit`, {
              initialValue: text,
              rules: [
                {
                  validator: (rule, value, callback) =>
                    this.compareToMin(
                      rule,
                      value,
                      callback,
                      `measuringList[${index}].minLimit`
                    ),
                },
              ],
            })(<InputNumberCell editable={true} />)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'unit',
        title: t('stationAutoManager.form.measuringUnit.label'),
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator(`measuringList[${index}].unit`, {
              initialValue: text,
            })(<Input />)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'name',
        title: '', //Action
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

  getDisableSelect = measureKeySelect => {
    const { measuringList } = this.props.form.getFieldsValue()
    return measuringList.some(measure => measure.name === measureKeySelect)
  }

  async componentWillMount() {
    this.setState({
      measuringList: this.props.dataSource.map((item, index) => {
        item.measuringKey = item.key
        item.key = index
        return item
      }),
    })
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

  compareToMax = (rule, value, callback, fliedName) => {
    const { form } = this.props
    const valueMax = form.getFieldValue(fliedName)
    if (isNumber(value) && isNumber(valueMax) && value >= valueMax) {
      callback(i18n.compareToMax)
    } else {
      callback()
    }
  }
  compareToMin = (rule, value, callback, fliedName) => {
    const { form } = this.props
    const valueMin = form.getFieldValue(fliedName)

    if (isNumber(value) && isNumber(valueMin) && value <= valueMin) {
      callback(i18n.compareToMin)
    } else {
      callback()
    }
  }
  render() {
    const { t } = this.props.lang
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
          columns={this.columns}
          pagination={{
            pageSize: 1000,
            hideOnSinglePage: true,
          }}
        />
      </div>
    )
  }
}
