import React from 'react'
// import PropTypes from "prop-types";
// import styled from "styled-components";
import {
  message,
  // Tabs,
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Icon,
  Popconfirm,
  Spin,
  Row,
  Col,
} from 'antd'
import { Clearfix } from 'containers/map/map-default/components/box-analytic-list/style'
import {
  getConfigWqiCalculation,
  postConfigWqiCalculation,
} from 'api/CategoryApi'
import { translate } from 'hoc/create-lang'
import * as _ from 'lodash'

const i18n = {
  submit: translate('addon.save'),
  warning: translate('addon.warning'),
  refresh: translate('addon.refresh'),
  cancel: translate('addon.cancel'),
  updateSuccess: translate('addon.onSave.update.success'),
  updateError: translate('addon.onSave.update.error'),

  add: translate('wqiConfigCalculation.add'),
  required: translate('wqiConfigCalculation.required'),
  colLevel: translate('wqiConfigCalculation.colLevel'),
  colMin: translate('wqiConfigCalculation.colMin'),
  colMax: translate('wqiConfigCalculation.colMax'),
  colColor: translate('wqiConfigCalculation.colColor'),
  colBackgroundColor: translate('wqiConfigCalculation.colBackgroundColor'),
  colDescription: translate('wqiConfigCalculation.colDescription'),
}

@Form.create({})
export default class TabMucDo extends React.Component {
  idIncrement = 0
  state = {
    isLoaded: false,
    isSubmit: false,
    dataSource: [],
    isLocked: false,
    isFormLoaded: false,
  }

  columns = [
    {
      title: i18n.colLevel,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`levelList[${record.key}].name`, {
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(<Input placeholder="Mức độ" />)}
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colMin,
      dataIndex: 'min',
      key: 'min',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`levelList[${record.key}].min`, {
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(
              <InputNumber
                style={{ width: '100%' }}
                placeholder={i18n.colMin}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colMax,
      dataIndex: 'max',
      key: 'max',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator, setFieldsValue } = this.props.form
        const isLast = this.state.dataSource.length === index + 1
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            <div style={{ display: 'flex' }}>
              {getFieldDecorator(`levelList[${record.key}].max`, {
                rules: [
                  {
                    required: !this.state.isLocked,
                    message: i18n.required,
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder={i18n.colMax}
                  disabled={isLast && this.state.isLocked}
                />
              )}
              {isLast && (
                <div
                  style={{
                    display: 'flex',
                    marginLeft: 8,
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    onClick={() => {
                      this.setState({ isLocked: !this.state.isLocked }, () => {
                        if (this.state.isLocked) {
                          setFieldsValue({
                            [`levelList[${record.key}].max`]: null,
                          })
                        }
                      })
                    }}
                    style={{
                      fontSize: 24,
                      color: this.state.isLocked ? '#1890ff' : 'red',
                      cursor: 'pointer',
                    }}
                    type={this.state.isLocked ? 'unlock' : 'lock'}
                  />
                </div>
              )}
            </div>
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colColor,
      dataIndex: 'colColor',
      key: 'color',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ marginBottom: 'initial' }}>
            {getFieldDecorator(`levelList[${record.key}].color`, {
              initialValue: '#fff',
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(<input type="color" />)}
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colBackgroundColor,
      dataIndex: 'colBackgroundColor',
      key: 'backgroundColor',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ marginBottom: 'initial' }}>
            {getFieldDecorator(`levelList[${record.key}].backgroundColor`, {
              initialValue: '#1d89ce',
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(<input type="color" />)}
          </Form.Item>
        )
      },
    },
    {
      title: i18n.colDescription,
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: (text, record, index) => {
        const { getFieldDecorator } = this.props.form
        return (
          <Form.Item style={{ textAlign: 'left', marginBottom: 'initial' }}>
            {getFieldDecorator(`levelList[${record.key}].description`, {
              rules: [
                {
                  required: true,
                  message: i18n.required,
                },
              ],
            })(<Input placeholder={i18n.colDescription} />)}
          </Form.Item>
        )
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record, index) => {
        return (
          <Popconfirm
            title="Are you sure delete this?"
            onConfirm={this.delete.bind(this, record.key)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
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

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ isSubmit: true })
        console.log('Received values of form: ', values)
        try {
          const transformData = _.get(values, 'levelList', []).filter(i =>
            _.identity(i)
          )

          // console.log("transformData", transformData);
          const response = await postConfigWqiCalculation(
            this.props.code,
            transformData
          )
          if (response.success) {
            message.success(i18n.updateSuccess)
          }
        } finally {
          this.setState({ isSubmit: false })
        }
      }
    })
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

  async componentDidMount() {
    const response = await getConfigWqiCalculation(this.props.code)
    if (response.success) {
      const transformData = _.get(response, 'data.value', []).filter(i =>
        _.identity(i)
      )
      const lastRecord = transformData[transformData.length - 1]
      let dataSource = transformData.map(item => {
        return {
          ...item,
          key: this.idIncrement++,
        }
      })

      this.setState(
        {
          dataSource,
          isLoaded: true,
          isLocked: lastRecord ? lastRecord.max == null : null,
        },
        () => {
          this.props.form.setFieldsValue({
            levelList: transformData,
          })
        }
      )
    }
  }

  render() {
    return (
      <Spin spinning={!this.state.isLoaded}>
        <Clearfix height={16} />
        <Table
          size="small"
          bordered
          dataSource={this.state.dataSource}
          columns={this.columns}
          pagination={false}
        />
        <Clearfix height={16} />
        <Row gutter={12}>
          <Col xs={12}>
            <Button block type="primary" onClick={this.add}>
              {i18n.add}
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              loading={this.state.isSubmit}
              block
              type="primary"
              onClick={this.submit}
            >
              {i18n.submit}
            </Button>
          </Col>
        </Row>
      </Spin>
    )
  }
}
