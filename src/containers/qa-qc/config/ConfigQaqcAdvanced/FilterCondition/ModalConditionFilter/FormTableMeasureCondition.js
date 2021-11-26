import { Col, Form, Icon, InputNumber, Row, Table, Button } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import React, { Component } from 'react'
import { FIELDS } from '../index'
import { v4 as uuidv4 } from 'uuid'

export default class FormTableMeasureCondition extends Component {
  state = {
    isShowModalConfirmDelete: false,
    conditions: [{ id: uuidv4() }],
    newExcludeMeasureList: [],
  }

  addCondition = () => {
    const currentData = [...this.state.conditions]
    const newData = {
      id: uuidv4(),
    }
    const newConditions = [...currentData, newData]

    this.setState({ conditions: newConditions })
  }

  deleteCondition = id => {
    const { conditions } = this.state
    const newConditions = conditions.filter(
      conditionItem => conditionItem.id !== id
    )
    this.setState({ conditions: newConditions })
  }

  handleConditionMeasureChange = async value => {
    const { measureList } = this.props
    const newMeasureList = await measureList.filter(
      measure => measure.name !== value
    )

    this.setState({ newExcludeMeasureList: newMeasureList })
  }

  columns = [
    {
      title: 'Thông số điều kiện',
      width: 402,
      render: (value, record, index) => {
        const { form, measureList } = this.props
        return (
          <Row type="flex" align="middle" gutter={12}>
            <Col span={12}>
              <Form.Item required={false}>
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${index}.measure`,
                  {
                    onChange: this.handleConditionMeasureChange,
                    rules: [
                      {
                        required: true,
                        message: 'Vui lòng chọn thông số',
                      },
                    ],
                  }
                )(
                  <SelectMeasureParameter
                    placeholder="Chọn thông số"
                    measuringList={measureList}
                    mode="single"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item required={false}>
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${index}.operator`,
                  {
                    initialValue: 'eq',
                  }
                )(<SelectOperator />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item required={false}>
                {form.getFieldDecorator(`${FIELDS.CONDITIONS}.${index}.value`, {
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng nhập giá trị',
                    },
                  ],
                })(<InputNumber placeholder="00" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
        )
      },
    },
    {
      title: 'Thông số loại bỏ',
      width: 528,
      render: (value, record, index) => {
        const { form } = this.props
        return (
          <Form.Item required={false}>
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${index}.excludeMeasures`,
              {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn ít nhất 1 thông số',
                  },
                ],
              }
            )(
              <SelectMeasureParameter
                measuringList={this.state.newExcludeMeasureList}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Lựa chọn thông số sẽ loại bỏ"
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: '',
      align: 'center',
      render: (value, record, index) => {
        return (
          <Button
            type="link"
            disabled={this.state.conditions.length > 1 ? false : true}
            onClick={() => this.deleteCondition(record.id)}
            style={{ marginBottom: '24px' }}
          >
            <Icon
              style={{
                color: this.state.conditions.length > 1 ? '#E64D3D' : '#A2A7B3',
              }}
              type="delete"
            />
          </Button>
        )
      },
    },
  ]

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.conditions}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
        footer={() => (
          <div style={{ cursor: 'pointer' }} onClick={this.addCondition}>
            <Row type="flex">
              <div style={{ marginRight: '10px' }}>
                <Icon type="plus" style={{ color: '#1890FF' }} />
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1890FF',
                }}
              >
                Thêm điều kiện lọc
              </div>
            </Row>
          </div>
        )}
      />
    )
  }
}
