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
import { PATTERN_NAME } from 'constants/format-string'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { langPropTypes } from '../../../../hoc/create-lang'
import { v4 as uuidv4 } from 'uuid'

const FormItem = Form.Item
const { Option } = Select

function i18n() {
  return {
    measureKey: translate('stationAutoManager.form.measuringKey.label'),
    measureName: translate('stationAutoManager.form.measuringName.label'),
    measureNameCalculate: translate(
      'stationAutoManager.form.measuringNameCalculate.label'
    ),
    functionCalculate: translate(
      'stationAutoManager.form.functionCalculate.label'
    ),
    unit: translate('stationAutoManager.form.measuringUnit.label'),
    popConfirm: translate('stationAutoManager.form.popConfirm'),
    addMeasuring: translate('stationAutoManager.addMeasuring.label'),
    indexCalculation: translate('stationAutoManager.form.indexCalculation'),
  }
}

@autobind
export default class StationAutoFormTableAdvanced extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    lang: langPropTypes,
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
    const {
      dataSource,
      onChangeStandardsVN,
      onChangeMeasuring,
      isStandardsVN,
    } = this.props
    let measuringListAdvanced = []

    measuringListAdvanced = _.map(dataSource, (item, index) => {
      return {
        ...item,
      }
    })
    if (isStandardsVN) {
      if (onChangeMeasuring) {
        this.setState({
          measuringListAdvanced: measuringListAdvanced,
        })
      }
      if (onChangeStandardsVN) {
        onChangeStandardsVN(false)
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

  getColumns = () => {
    const { getFieldDecorator } = this.props.form

    return [
      {
        dataIndex: 'key',
        align: 'center',
        title: i18n().measureKey,
        width: 130,
        render: (text, record, index) => (
          <FormItem style={{ marginBottom: 0 }}>
            {this.props.form.getFieldDecorator(
              `measuringListAdvanced.${record.id}.key`,
              {
                initialValue: text,
              }
            )(<span>{text}</span>)}
          </FormItem>
        ),
      },
      {
        dataIndex: 'name',
        align: 'center',
        title: i18n().measureName,
        width: 130,
        render: (text, record, index) => {
          const { measuringOptionsAdvanced } = this.state
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`measuringListAdvanced.${record.id}.name`, {
                initialValue: record.name,
              })(
                <AutoCompleteCell
                  style={{ width: '100%' }}
                  editable={this._isEnableEditMeasure(record.key)}
                  onChange={value =>
                    this.handleChangeMeasuring(value, record, index)
                  }
                  options={measuringOptionsAdvanced}
                />
              )}
            </FormItem>
          )
        },
      },
      {
        dataIndex: 'nameCalculate',
        title: i18n().measureNameCalculate,
        align: 'center',
        width: 150,
        render: (text, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(
                `measuringListAdvanced.${record.id}.nameCalculate`,
                {
                  initialValue: text,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: translate(
                        'stationAutoManager.form.measuringNameCalculate.required'
                      ),
                    },
                    {
                      pattern: PATTERN_NAME,
                      message: translate(
                        'stationAutoManager.form.name.pattern'
                      ),
                    },
                    {
                      max: 64,
                      message: translate('stationAutoManager.form.name.max'),
                    },
                  ],
                }
              )(
                <Input
                  onChange={e =>
                    this.handleOnChangeNameCalculate(
                      e.target.value,
                      record,
                      index
                    )
                  }
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          )
        },
      },
      {
        dataIndex: 'functionCalculate',
        align: 'center',
        title: i18n().functionCalculate,
        width: 160,
        render: (text, record, index) => (
          <Row type="flex" justify="center" align="middle" gutter={2}>
            <Col span={18}>
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator(
                  `measuringListAdvanced.${record.id}.functionCalculate`,
                  {
                    initialValue: 'indexCalculation',
                  }
                )(
                  <Select
                    style={{ width: '100%' }}
                    defaultValue={'indexCalculation'}
                  >
                    <Option value="indexCalculation">
                      {i18n().indexCalculation}
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button
                type="link"
                href="https://global-docs.ilotusland.com/docs/references/t%C3%ADnh-to%C3%A1n-d%E1%BB%AF-li%E1%BB%87u/"
              >
                <img
                  src={ExportIcon}
                  alt="exportIcon"
                  style={{ marginRight: '8px', width: '20px' }}
                />
              </Button>
            </Col>
          </Row>
        ),
      },
      {
        dataIndex: 'unit',
        title: i18n().unit,
        align: 'center',
        width: 100,
        render: (text, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`measuringListAdvanced.${record.id}.unit`, {
                initialValue: text,
                rule: {
                  whitespace: true,
                },
              })(<Input disabled={true} style={{ width: '100%' }} />)}
            </FormItem>
          )
        },
      },
      {
        title: '',
        width: 50,
        render: (text, record, index) => {
          return (
            <div
              style={{
                textAlign: 'center',
              }}
              className="editable-row-operations"
            >
              <span>
                <Popconfirm
                  title={i18n().popConfirm}
                  onConfirm={() => this.removeMeasuring(record.id)}
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
    const { measuringListAdvanced } = this.state
    const newRow = {
      id: uuidv4(),
      key: '',
      name: '',
      nameCalculate: '',
      functionCalculate: 'indexCalculation',
      unit: '',
    }
    let rows = update(measuringListAdvanced, { $push: [newRow] })
    this.setState({ measuringListAdvanced: rows })
    this.setState({
      measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
    })
  }

  removeMeasuring(id) {
    const { measuringListAdvanced } = this.state

    const newMeasuringListAdvanced = measuringListAdvanced.filter(
      item => item.id !== id
    )
    this.setState({
      measuringListAdvanced: newMeasuringListAdvanced,
      measuringOptionsAdvanced: this.getOptions(newMeasuringListAdvanced),
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

    let measuringSelected

    arr.forEach(element => {
      if (element.key === meaKey) measuringSelected = element
    })

    return arr.includes(measuringSelected)
  }

  render() {
    const { isLoaded, measuringListAdvanced } = this.state

    return (
      <div>
        {isLoaded && (
          <Table
            bordered
            rowKey={record => record.id}
            dataSource={measuringListAdvanced}
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
                  {i18n().addMeasuring}
                </Button>
              </Row>
            )}
          />
        )}
      </div>
    )
  }

  handleChangeMeasuring = (value, record, index) => {
    const { measuringListSource, form } = this.props
    const { measuringListAdvanced } = this.state

    const measure = measuringListSource.find(item => item.key === value)

    form.resetFields([`measuringListAdvanced.${record.id}.nameCalculate`])

    const newMeasuringListAdvanced = measuringListAdvanced.map(
      measuringAdvanced => {
        return measuringAdvanced.id === record.id
          ? {
              id: record.id,
              key: value,
              name: measure.name,
              nameCalculate: undefined,
              unit: measure.unit,
            }
          : measuringAdvanced
      }
    )

    this.setState({ measuringListAdvanced: newMeasuringListAdvanced })
  }

  handleOnChangeNameCalculate = (value, record, index) => {
    const { measuringListAdvanced } = this.state

    const newMeasuringListAdvanced = measuringListAdvanced.map(
      measuringAdvanced => {
        return measuringAdvanced.id === record.id
          ? {
              id: record.id,
              key: record.key,
              name: record.name,
              nameCalculate: value,
              unit: record.unit,
              functionCalculate: 'indexCalculation',
            }
          : measuringAdvanced
      }
    )

    this.setState({ measuringListAdvanced: newMeasuringListAdvanced })
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoaded, measuringListAdvanced } = this.state
    const { onChangeMeasuring, measuringListSource } = this.props
    if (isLoaded) {
      if (
        JSON.stringify(prevState.measuringListAdvanced) !==
        JSON.stringify(measuringListAdvanced)
      ) {
        if (onChangeMeasuring) {
          this.setState({
            measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
          })
          onChangeMeasuring(measuringListAdvanced)
        }
      }
      if (
        JSON.stringify(prevProps.measuringListSource) !==
        JSON.stringify(measuringListSource)
      ) {
        this.setState({
          measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
        })
      }
    }
  }
}
