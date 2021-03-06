import React from 'react'
import PropTypes from 'prop-types'
// import styled from "styled-components";
import {
  message,
  Button,
  Table,
  Form,
  InputNumber,
  Input,
  Icon,
  Popconfirm,
  Spin,
  Row,
  Col,
} from 'antd'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import { getConfigWqiMeaTable, postConfigWqiMeaTable } from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'
import LockComp from './lockComp'

function i18n() {
  return {
    submit: translate('addon.save'),
    warning: translate('addon.warning'),
    refresh: translate('addon.refresh'),
    yes: translate('add.yes'),
    cancel: translate('addon.cancel'),
    confirmMsgDelete: translate('confirm.msg.delete'),
    updateSuccess: translate('addon.onSave.update.success'),
    updateError: translate('addon.onSave.update.error'),
    required: translate('wqiConfigCalculation.required'),

    add: translate('wqiConfigCalculation.add'),
    collevel: translate('wqiConfigCalculation.collevel'),
    colMin2: translate('wqiConfigCalculation.colMin2'),
    colMax2: translate('wqiConfigCalculation.colMax2'),
    colValue: translate('wqiConfigCalculation.colValue'),
    compareToMax: translate('wqiConfigCalculation.compareToMax'),
    compareToMin: translate('wqiConfigCalculation.compareToMin'),
  }
}

const CODE = 'vi'
@Form.create({})
export default class TabGiaTri_NhomV extends React.Component {
  static propTypes = {
    configMeasure: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      isSubmit: false,
      dataSource: [],
      isLockFirst: {},
      isLockLast: {},
    }
    const styleWidth = { width: '100%' }
    const columnDynamic = []
    props.configMeasure.forEach(item => {
      columnDynamic.push({
        title: i18n().colValue + ' ' + item.keyMeasure,
        children: [
          {
            title: i18n().colMin2,
            dataIndex: 'min_' + item.keyMeasure,
            key: 'min_' + item.keyMeasure,
            align: 'center',
            width: 150,
            render: (text, record, index) => {
              const { getFieldDecorator, setFieldsValue } = this.props.form
              const isFirst = index === 0
              return (
                <Form.Item
                  style={{ textAlign: 'left', marginBottom: 'initial' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 130,
                    }}
                  >
                    {isFirst && (
                      <LockComp
                        right={8}
                        isLocked={this.state.isLockFirst[item.keyMeasure]}
                        onClick={() => {
                          this.setState({
                            isLockFirst: {
                              ...this.state.isLockFirst,
                              [item.keyMeasure]: this.state.isLockFirst[
                                item.keyMeasure
                              ]
                                ? false
                                : true,
                            },
                          })
                          setFieldsValue({
                            [`levelList[${record.key}].${item.keyMeasure}.min`]: null,
                          })
                        }}
                      />
                    )}
                    {getFieldDecorator(
                      `levelList[${record.key}].${item.keyMeasure}.min`,
                      {
                        rules: [
                          {
                            required:
                              !item.isBelongTemp &&
                              !(
                                isFirst &&
                                this.state.isLockFirst[item.keyMeasure]
                              ),
                            message: i18n().required,
                          },
                          {
                            validator: (rule, value, callback) =>
                              this.compareToMax(
                                rule,
                                value,
                                callback,
                                `levelList[${record.key}].${item.keyMeasure}.max`
                              ),
                          },
                        ],
                      }
                    )(
                      <InputNumber
                        style={{ ...styleWidth }}
                        placeholder={i18n().colMin2}
                        disabled={
                          item.isBelongTemp ||
                          (isFirst && this.state.isLockFirst[item.keyMeasure])
                        }
                      />
                    )}
                  </div>
                </Form.Item>
              )
            },
          },
          {
            title: i18n().colMax2,
            dataIndex: 'max_' + item.keyMeasure,
            key: 'max_' + item.keyMeasure,
            align: 'center',
            width: 150,
            render: (text, record, index) => {
              const { getFieldDecorator, setFieldsValue } = this.props.form
              const isLast = this.state.dataSource.length === index + 1
              return (
                <Form.Item
                  style={{ textAlign: 'left', marginBottom: 'initial' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 130,
                    }}
                  >
                    {getFieldDecorator(
                      `levelList[${record.key}].${item.keyMeasure}.max`,
                      {
                        rules: [
                          {
                            required:
                              !item.isBelongTemp &&
                              !(
                                isLast && this.state.isLockLast[item.keyMeasure]
                              ),
                            message: i18n().required,
                          },
                          {
                            validator: (rule, value, callback) =>
                              this.compareToMin(
                                rule,
                                value,
                                callback,
                                `levelList[${record.key}].${item.keyMeasure}.min`
                              ),
                          },
                        ],
                      }
                    )(
                      <InputNumber
                        style={{ ...styleWidth }}
                        placeholder={i18n().colMax2}
                        disabled={
                          item.isBelongTemp ||
                          (isLast && this.state.isLockLast[item.keyMeasure])
                        }
                      />
                    )}
                    {isLast && (
                      <LockComp
                        left={8}
                        isLocked={this.state.isLockLast[item.keyMeasure]}
                        onClick={() => {
                          this.setState({
                            isLockLast: {
                              ...this.state.isLockLast,
                              [item.keyMeasure]: this.state.isLockLast[
                                item.keyMeasure
                              ]
                                ? false
                                : true,
                            },
                          })
                          setFieldsValue({
                            [`levelList[${record.key}].${item.keyMeasure}.max`]: null,
                          })
                        }}
                      />
                    )}
                  </div>
                </Form.Item>
              )
            },
          },
        ],
      })
    })
    this.columns = [
      {
        title: i18n().collevel,
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 150,
        render: (text, record, index) => {
          const { getFieldDecorator } = this.props.form
          return (
            <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
              {getFieldDecorator(`levelList[${record.key}].name`, {
                rules: [
                  {
                    required: true,
                    message: i18n().required,
                  },
                ],
              })(<Input placeholder={i18n().collevel} />)}
            </Form.Item>
          )
        },
      },
      {
        title: i18n().colValue + ' qi',
        children: [
          {
            title: 'qi',
            dataIndex: 'min_qi',
            key: 'min_qi',
            align: 'center',
            width: 150,
            render: (text, record, index) => {
              const { getFieldDecorator } = this.props.form
              return (
                <Form.Item
                  style={{
                    textAlign: 'left',
                    marginBottom: 'initial',
                    minWidth: 100,
                  }}
                >
                  {getFieldDecorator(`levelList[${record.key}].qi`, {
                    rules: [
                      {
                        required: true,
                        message: i18n().required,
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ ...styleWidth }}
                      placeholder={i18n().colMin2}
                    />
                  )}
                </Form.Item>
              )
            },
          },
          {
            title: 'qi+1',
            dataIndex: 'max_qi',
            key: 'max_qi',
            align: 'center',
            width: 150,
            render: (text, record, index) => {
              const { getFieldDecorator } = this.props.form
              return (
                <Form.Item
                  style={{
                    textAlign: 'left',
                    marginBottom: 'initial',
                    minWidth: 100,
                  }}
                >
                  {getFieldDecorator(`levelList[${record.key}].qi_1`, {
                    rules: [
                      {
                        required: true,
                        message: i18n().required,
                      },
                    ],
                  })(
                    <InputNumber
                      style={{ ...styleWidth }}
                      placeholder={i18n().colMax2}
                    />
                  )}
                </Form.Item>
              )
            },
          },
        ],
      },
      ...columnDynamic,
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        width: 80,
        align: 'center',
        render: (text, record, index) => {
          return (
            <Popconfirm
              onConfirm={this.delete.bind(this, record.key)}
              title={i18n().confirmMsgDelete}
              okText={i18n().yes}
              cancelText={i18n().cancel}
              placement="left"
            >
              <Icon
                type="delete"
                style={{ color: 'red', fontSize: 24, cursor: 'pointer' }}
              />
            </Popconfirm>
          )
        },
      },
    ]
    this.idIncrement = 0
  }

  compareToMax = (rule, value, callback, fliedName) => {
    const { form } = this.props
    const valueMax = form.getFieldValue(fliedName)
    if (_.isNumber(value) && _.isNumber(valueMax) && value >= valueMax) {
      callback(i18n().compareToMax)
    } else {
      callback()
    }
  }

  compareToMin = (rule, value, callback, fliedName) => {
    const { form } = this.props
    const valueMin = form.getFieldValue(fliedName)

    if (_.isNumber(value) && _.isNumber(valueMin) && value <= valueMin) {
      callback(i18n().compareToMin)
    } else {
      callback()
    }
  }

  async componentDidMount() {
    const response = await getConfigWqiMeaTable(CODE)
    if (response.success) {
      const transformData = _.get(response, 'data.value.groupV', []).filter(i =>
        _.identity(i)
      )
      let dataSource = transformData.map(i => {
        return {
          ...i,
          key: this.idIncrement++,
        }
      })

      const isLockFirst = this.state.isLockFirst
      const firstItem = transformData[0] || {}
      for (let key in firstItem) {
        if (_.get(firstItem, `${key}.min`) == null) isLockFirst[key] = true
      }

      const isLockLast = this.state.isLockLast
      const lastItem = transformData[transformData.length - 1]
      for (let key in lastItem) {
        if (_.get(lastItem, `${key}.max`) == null) isLockLast[key] = true
      }
      this.setState(
        {
          isLoaded: true,
          dataSource,
          isLockFirst,
          isLockLast,
        },
        () => {
          setTimeout(() => {
            this.props.form.setFieldsValue({
              levelList: transformData,
            })
          }, 0)
        }
      )
    }
  }
  add = () => {
    this.setState({
      dataSource: [
        ...this.state.dataSource,
        {
          key: this.idIncrement++,
        },
      ],
    })
  }
  delete = key => {
    let tamp = this.state.dataSource.filter(item => item.key !== key)
    this.setState({
      dataSource: [...tamp],
    })
  }
  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true })
        // console.log('Received values of form: ', values)
        try {
          const transformData = _.get(values, 'levelList', []).filter(i =>
            _.identity(i)
          )
          const response = await postConfigWqiMeaTable(CODE, {
            groupV: transformData,
          })
          if (response.success) {
            message.success(i18n().updateSuccess)
          }
        } finally {
          this.setState({ isSubmit: false })
        }
      }
    })
  }
  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Table
          size="small"
          bordered
          columns={this.columns}
          dataSource={this.state.dataSource}
          pagination={false}
          scroll={{ x: 900 }}
        />
        <Clearfix height={16} />
        <Row gutter={12}>
          <Col xs={12}>
            <Button block type="primary" onClick={this.add}>
              {i18n().add}
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              loading={this.state.isSubmit}
              block
              type="primary"
              onClick={this.submit}
            >
              {i18n().submit}
            </Button>
          </Col>
        </Row>
      </Spin>
    )
  }
}
