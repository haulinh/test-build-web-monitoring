import React from 'react'
import { Form, Button, Select, Table, Popconfirm, Icon, Input } from 'antd'
import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import { langPropTypes } from '../../../../hoc/create-lang'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import InputNumberCell from '../../../../components/elements/input-number-cell'
import update from 'immutability-helper'
import * as _ from 'lodash'

const FormItem = Form.Item

@autobind
export default class StationAutoFormTable extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    lang: langPropTypes,
    dataSource: PropTypes.array,
    measuringListSource: PropTypes.array,
    allowUpdateStandardsVN: PropTypes.bool, 
    standardsVN: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      standardsVN: props.standardsVN
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.standardsVN, this.props.standardsVN)) {
      this.setState({ standardsVN: nextProps.standardsVN })
    }
  }

  async componentWillMount() {
    this.setState({
      measuringList: this.props.dataSource.map((item, index) => {
        item.measuringKey = item.key
        item.key = index
        return item
      })
    })
  }

  handleAddRow() {
    const newRow = {
      key: this.state.measuringList.length,
      name: '',
      unit: ''
    }
    let rows = this.state.measuringList.slice()
    rows = update(rows, { $push: [newRow] })
    this.setState({ measuringList: rows })
  }

  getValueStandardVN = (record, field) => {
    const value = _.get( _.get(this.state.standardsVN, _.get(record, 'measuringKey'), {}), field, undefined)
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
            unit: { $set: measure.unit }
          }
        }
      })
    )
  }

  renderItemCell = (text, record, index, key) => (
    <FormItem style={{ marginBottom: 0 }}>
      {this.props.form.getFieldDecorator(`measuringList[${index}].${key}`, {
        initialValue: text
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
          initialValue: text
        })(<InputNumberCell style={{ width: 120 }} editable={true} />)}
      </FormItem>
    )
  }

  getColumns = () => {
    const { t } = this.props.lang
    const { getFieldDecorator } = this.props.form
    return [
      {
        dataIndex: 'measuringKey',
        title: t('stationAutoManager.form.measuringKey.label'),
        width: 130,
        render: (text, record, index) => this.renderItemCell(text, record, index, 'key')
      },
      {
        dataIndex: 'measuringName',
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
                    t('stationAutoManager.form.measuringName.label')
                }
              ]
            })(
              <AutoCompleteCell
                style={{ width: 120 }}
                editable={true}
                onChange={value =>
                  this.handleChangeMeasuring(value, index, 'name')
                }
                options={this.props.measuringListSource.map(d => (
                  <Select.Option key={d.key} value={d.key}>
                    {d.name}
                  </Select.Option>
                ))}
                autoFocus={true}
              />
            )}
          </FormItem>
        )
      },
      {
        title:  t('stationAutoManager.form.range.label'),
        children: [
          {
            dataIndex: 'minRange',
            title: t('stationAutoManager.form.measuringMinRange.label'),
            width: 150,
            render: (text, record, index) => this.renderItemNumberCell(text, record, index, 'minRange')
          },
          {
            dataIndex: 'maxRange',
            title: t('stationAutoManager.form.measuringMaxRange.label'),
            width: 150,
            render: (text, record, index) => this.renderItemNumberCell(text, record, index, 'maxRange')
          }
        ]
      },
      {
        title:  t('stationAutoManager.form.qcvn.label'),
        children: [
          {
            dataIndex: 'minLimit',
            title: t('stationAutoManager.form.measuringMinLimit.label'),
            width: 150,
            render: (text, record, index) => this.renderItemNumberCell(text, record, index, 'minLimit', true)
          },
          {
            dataIndex: 'maxLimit',
            title: t('stationAutoManager.form.measuringMaxLimit.label'),
            width: 150,
            render: (text, record, index) => this.renderItemNumberCell(text, record, index, 'maxLimit', true)
          }
        ]
      },
      {
        dataIndex: 'unit',
        title: t('stationAutoManager.form.measuringUnit.label'),
        width: 150,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringList[${index}].unit`, {
              initialValue: text
            })(<Input style={{ width: 120 }} />)}
          </FormItem>
        )
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
        }
      }
    ]
  }

  render() {
    const { t } = this.props.lang
    console.log('standardsVN', this.props.standardsVN)
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
            hideOnSinglePage: true
          }}
        />
      </div>
    )
  }
}
