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
        id: (index + 1).toString(),
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
              `measuringListAdvanced[${index}].key`,
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
              {getFieldDecorator(`measuringListAdvanced[${index}].name`, {
                initialValue: record.name,
              })(
                <AutoCompleteCell
                  style={{ width: '100%' }}
                  editable={this._isEnableEditMeasure(record.key)}
                  onChange={value => this.handleChangeMeasuring(value, index)}
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
                `measuringListAdvanced[${index}].nameCalculate`,
                {
                  initialValue: text,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: translate(
                        'stationAutoManager.form.name.required'
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
                  onChange={value =>
                    this.handleOnChangeNameCalculate(value, index)
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
                  `measuringListAdvanced[${index}].functionCalculate`,
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
          const measuring = this.props.measuringList.find(
            measuring => measuring.key === record.key
          )
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`measuringListAdvanced[${index}].unit`, {
                initialValue: measuring ? measuring.unit : text,
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
    const { measuringListAdvanced } = this.state
    const newRow = {
      id: (measuringListAdvanced.length + 1).toString(),
      key: '',
      name: '',
      functionCalculate: 'indexCalculation',
      unit: '',
    }
    let rows = update(measuringListAdvanced, { $push: [newRow] })
    this.setState({ measuringListAdvanced: rows })
    this.setState({
      measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
    })
  }

  removeMeasuring(index) {
    const { measuringListAdvanced } = this.state

    measuringListAdvanced.splice(index, 1)
    this.setState({
      measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
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

    arr.map(element => {
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
            rowKey="id"
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

  handleChangeMeasuring = (value, index) => {
    const { measuringListSource, form } = this.props

    const measure = measuringListSource.find(item => item.key === value)

    form.setFieldsValue({
      [`measuringListAdvanced[${index}]`]: { nameCalculate: undefined },
    })

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

  handleOnChangeNameCalculate = (value, index) => {
    this.setState(
      update(this.state, {
        measuringListAdvanced: {
          [index]: {
            nameCalculate: { $set: value },
          },
        },
      })
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoaded, measuringListAdvanced } = this.state
    const { form, onChangeMeasuring, measuringListSource } = this.props
    if (isLoaded) {
      let measuringListAdvancedForm =
        form.getFieldValue('measuringListAdvanced') || []
      let measuringListAdvancedFilter = _.values(
        measuringListAdvancedForm
      ).filter((element, index) => element !== undefined)
      if (
        JSON.stringify(prevState.measuringListAdvanced) !==
        JSON.stringify(measuringListAdvanced)
      ) {
        if (onChangeMeasuring) {
          this.setState({
            measuringListAdvanced: measuringListAdvancedFilter,
            measuringOptionsAdvanced: this.getOptions(measuringListAdvanced),
          })
          onChangeMeasuring(measuringListAdvancedFilter)
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
