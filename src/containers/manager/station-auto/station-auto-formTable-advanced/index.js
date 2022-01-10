import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
} from 'antd'
import ExportIcon from 'assets/svg-icons/Export.svg'
import AutoCompleteCell from 'components/elements/auto-complete-cell'
import { autobind } from 'core-decorators'
import update from 'immutability-helper'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const FormItem = Form.Item
const { Option } = Select

@autobind
export default class StationAutoFormTableAdvanced extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    dataSource: PropTypes.array,
    measuringListSource: PropTypes.array,
    standardsVN: PropTypes.array,
    isEdit: PropTypes.bool,
    onChangeMeasuring: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      measuringListAdvanced: [],
      isLoaded: false,
      measuringOptionsAdvanced: [],
    }
  }

  async componentDidMount() {
    let measuringListAdvanced = []

    measuringListAdvanced = _.map(this.props.dataSource, (item, index) => {
      return {
        ...item,
        id: (index + 1).toString(),
      }
    })
    if (this.props.isStandardsVN) {
      measuringListAdvanced = this.updateMinMaxOfMeasuring(
        measuringListAdvanced
      )
      if (this.props.onChangeMeasuring) {
        this.setState({
          measuringListAdvanced: measuringListAdvanced,
        })
      }
      if (this.props.onChangeStandardsVN) {
        this.props.onChangeStandardsVN(false)
      }
    }

    this.setState({
      isLoaded: true,
      measuringListAdvanced: measuringListAdvanced,
      measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
    })
  }

  getOptions(measuringListAdvanced) {
    const data = _.get(this.props, 'measuringListSource', []).map(d => (
      <Select.Option
        disabled={this._isEnableSelectMeasure(d.key, measuringListAdvanced)}
        key={d.key}
        value={d.key}
      >
        {d.name}
      </Select.Option>
    ))
    return data
  }

  updateMinMaxOfMeasuring = dataSource => {
    const measuringListAdvanced = _.map(dataSource, (item, index) => {
      let itemQCVN = this.props.standardsVN.find(obj => obj.key === item.key)

      return {
        ...item,
        id: (index + 1).toString(),
        maxLimit: itemQCVN ? itemQCVN.maxLimit : item.maxLimit,
        minLimit: itemQCVN ? itemQCVN.minLimit : item.minLimit,
      }
    })
    return measuringListAdvanced
  }

  getColumns = () => {
    const { getFieldDecorator } = this.props.form

    return [
      {
        dataIndex: 'key',
        align: 'center',
        title: 'Mã thông số',
        width: 100,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {this.props.form.getFieldDecorator(`measuringList[${index}].key`, {
              initialValue: text,
            })(<span>{text}</span>)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'name',
        align: 'center',
        title: 'Tên thông số',
        width: 130,
        render: (text, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(
                `measuringListAdvanced[${index}].name`,
                {}
              )(
                <AutoCompleteCell
                  style={{ width: 150 }}
                  editable={this._isEnableEditMeasure(record.key)}
                  onChange={value => this.handleChangeMeasuring(value, index)}
                  options={this.state.measuringOptionsAdvanced}
                />
              )}
            </FormItem>
          )
        },
      },
      {
        dataIndex: 'name',
        title: 'Tên thông số tính toán',
        align: 'center',
        width: 100,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(
              `measuringListAdvanced[${index}].nameCacl`,
              {}
            )(<Input style={{ width: 120 }} />)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'cacl',
        align: 'center',
        title: 'Hàm tính toán',
        width: 130,
        render: (text, record, index) => (
          <Row type="flex" justify="center" align="middle" gutter={12}>
            <Col span={20}>
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator(`measuringListAdvanced[${index}].cacl`, {
                  initialValue: 'cacl',
                })(
                  <Select style={{ width: 140 }} defaultValue={'cacl'}>
                    <Option value="cacl">Tính toán chỉ số</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <img
                src={ExportIcon}
                alt="exportIcon"
                style={{ marginRight: '8px', width: '20px' }}
              />
            </Col>
          </Row>
        ),
      },
      {
        dataIndex: 'unit',
        title: 'Đơn vị',
        align: 'center',
        width: 150,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`measuringListAdvanced[${index}].unit`, {
              initialValue: text,
              rule: {
                whitespace: true,
              },
            })(<Input style={{ width: 200 }} />)}
          </FormItem>
        ),
      },
      {
        title: '',
        width: 50,
        render: (text, record, index) => {
          const total = this.state.measuringListAdvanced
            ? this.state.measuringListAdvanced.length
            : 0
          return (
            <div
              style={{
                textAlign: 'center',
              }}
              className="editable-row-operations"
            >
              <span>
                <Popconfirm
                  title="Bạn chắc chắn xóa dữ liệu?"
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
            </div>
          )
        },
      },
    ]
  }

  handleAddRow() {
    const newRow = {
      id: (this.state.measuringListAdvanced.length + 1).toString(),
      key: '',
      name: '',
      unit: '',
    }
    let rows = this.state.measuringListAdvanced.slice()
    rows = update(rows, { $push: [newRow] })
    this.setState({ measuringListAdvanced: rows })
    this.setState({
      measuringOptionsAdvanced: this.getOptions(
        this.state.measuringListAdvanced
      ),
    })
  }

  getValueStandardVN = (record, field) => {
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
    this.state.measuringListAdvanced.splice(index, 1)
    this.setState({
      measuringOptionsAdvanced: this.getOptions(
        this.state.measuringListAdvanced
      ),
    })
    this.forceUpdate()
  }

  _isEnableEditMeasure = meaKey => {
    const listKey = this.props.standardsVN.map(item => item.key)
    if (_.includes(listKey, meaKey)) {
      return false
    }
    return true
  }

  _isEnableSelectMeasure = (meaKey, measuringListAdvanced) => {
    const arr = measuringListAdvanced
    if (!arr || arr.length < 1) {
      return false
    }

    const index = _.findIndex(arr, i => {
      return i.key !== meaKey
    })
    if (index > -1) {
      return false
    }

    return true
  }

  render() {
    return (
      <div>
        {this.state.isLoaded && (
          <Table
            bordered
            rowKey="id"
            dataSource={this.state.measuringListAdvanced}
            columns={this.getColumns()}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true,
            }}
            footer={() => (
              <Row type="flex" style={{ color: '#1890FF' }} align="middle">
                <Button
                  type="link"
                  style={{ fontWeight: 500, fontSize: '16px' }}
                  onClick={this.handleAddRow}
                >
                  <Icon type="plus" style={{ marginRight: 5 }} />
                  Thêm thông số
                </Button>
              </Row>
            )}
          />
        )}
      </div>
    )
  }

  handleChangeMeasuring = (value, index) => {
    const measure = this.props.measuringListSource.find(
      item => item.key === value
    )

    this.setState(
      update(this.state, {
        measuringListAdvanced: {
          [index]: {
            key: { $set: value },
            name: { $set: measure.name },
            unit: { $set: measure.unit },
          },
        },
      })
    )
  }
}
