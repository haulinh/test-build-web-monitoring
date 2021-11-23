import { Col, Form, Icon, InputNumber, Row, Table } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import React, { Component } from 'react'
import { FIELDS } from '../index'

export default class FormTableMeasureCondition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isDeleteVisible: false,
      conditions: [],
    }
  }

  addCondition = () => {
    const currentData = [...this.state.conditions]
    const newData = {
      id: '1',
    }
    const newDataSource = [...currentData, newData]

    this.setState({ dataSource: newDataSource })
  }

  deleteCondition = id => {
    const { conditions } = this.state
    const newConditions = conditions.filter(
      conditionItem => conditionItem.id !== id
    )
    this.setState({ conditions: newConditions })
  }

  columns = [
    {
      title: 'Thông số điều kiện',
      dataIndex: 'conditionMeasure',
      width: 402,
      render: (value, index) => {
        const { form, measureList } = this.props
        return (
          <Row type="flex" align="middle" gutter={12}>
            <Col span={12}>
              <Form.Item required={false}>
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${index}.measure`,
                  {}
                )(
                  <SelectMeasureParameter
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
                {form.getFieldDecorator(
                  `${FIELDS.CONDITIONS}.${index}.value`,
                  {}
                )(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
        )
      },
    },
    {
      title: 'Thông số loại bỏ',
      dataIndex: 'removeMeasure',
      width: 528,
      render: (value, index) => {
        const { form, measureList } = this.props
        return (
          <Form.Item required={false}>
            {form.getFieldDecorator(
              `${FIELDS.CONDITIONS}.${index}.excludeMeasures`,
              {}
            )(
              <SelectMeasureParameter
                measuringList={measureList}
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
      dataIndex: 'option',
      align: 'center',
      render: (value, index) => {
        return (
          <div
            onClick={() => {
              this.setState({ isDeleteVisible: true })
            }}
            style={{ marginBottom: '24px' }}
          >
            <Row type="flex">
              <Icon
                onClick={() => this.deleteCondition(index)}
                style={{ color: '#E64D3D' }}
                type="delete"
              />
            </Row>
          </div>
        )
      },
    },
  ]

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.dataSource}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
        footer={() => (
          <div onClick={this.addCondition}>
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
