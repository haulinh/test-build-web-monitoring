import { Button, Col, Icon, InputNumber, Row, Table } from 'antd'
import SelectOperator from 'components/core/select/SelectOperator'
import SelectMeasureParameter from 'components/elements/select-measure-parameter'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { FIELDS } from '../index'

const TableCondition = styled(Table)`
  .ant-table-tbody > tr > td {
    padding: 12px 16px 0px 16px;
  }
`

export default class FormTableMeasureCondition extends Component {
  state = {
    isShowModalConfirmDelete: false,
    conditions: [{ id: uuidv4() }],
    conditionsEdit: [],
  }

  setInitData = conditions => {
    this.setState(
      {
        conditionsEdit: conditions.map(item => ({ id: uuidv4(), ...item })),
      },
      () => {
        const { conditionsEdit } = this.state
        const { form } = this.props
        conditionsEdit.forEach(item => {
          form.setFieldsValue({
            [`${FIELDS.CONDITIONS}.${item.id}.measure`]: item.measure,
            [`${FIELDS.CONDITIONS}.${item.id}.operator`]: item.operator,
            [`${FIELDS.CONDITIONS}.${item.id}.value`]: item.value,
            [`${FIELDS.CONDITIONS}.${item.id}.excludeMeasures`]: item.excludeMeasures,
          })
        })
      }
    )
  }

  addCondition = () => {
    const { conditions, conditionsEdit } = this.state
    const newData = {
      id: uuidv4(),
    }
    const newConditions = [...conditions, newData]
    const newConditionsEdit = [...conditionsEdit, newData]

    this.setState({
      conditions: newConditions,
      conditionsEdit: newConditionsEdit,
    })
  }

  deleteCondition = id => {
    const { conditions, conditionsEdit } = this.state
    const newConditions = conditions.filter(item => item.id !== id)
    const newConditionsEdit = conditionsEdit.filter(item => item.id !== id)

    this.setState({
      conditions: newConditions,
      conditionsEdit: newConditionsEdit,
    })
  }

  handleConditionMeasureChange = excludeMeasuresField => {
    const { form } = this.props
    form.resetFields(excludeMeasuresField)
  }

  getExcludeMeasureList = (measureField, measure) => {
    const { measureList, form } = this.props
    if (!measure) {
      return []
    }
    return measureList.filter(
      measure => measure.key !== form.getFieldValue(measureField)
    )
  }

  getColumns = () => {
    return [
      {
        title: 'Thông số điều kiện',
        width: 402,
        render: (value, record, index) => {
          const { form, measureList } = this.props
          const excludeMeasuresField = `${FIELDS.CONDITIONS}.${record.id}.excludeMeasures`

          return (
            <Row type="flex" align="middle" gutter={12}>
              <Col span={12}>
                <FormItem required={false} marginBottom="12px">
                  {form.getFieldDecorator(
                    `${FIELDS.CONDITIONS}.${record.id}.measure`,
                    {
                      onChange: () => {
                        this.handleConditionMeasureChange(excludeMeasuresField)
                      },
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
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem required={false} marginBottom="12px">
                  {form.getFieldDecorator(
                    `${FIELDS.CONDITIONS}.${record.id}.operator`,
                    {
                      initialValue: 'eq',
                    }
                  )(<SelectOperator />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem required={false} marginBottom="12px">
                  {form.getFieldDecorator(
                    `${FIELDS.CONDITIONS}.${record.id}.value`,
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Vui lòng nhập giá trị',
                        },
                      ],
                    }
                  )(<InputNumber placeholder="00" style={{ width: '100%' }} />)}
                </FormItem>
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

          const measureValue = form.getFieldValue(
            `${FIELDS.CONDITIONS}.${record.id}.measure`
          )
          return (
            <FormItem required={false} marginBottom="12px">
              {form.getFieldDecorator(
                `${FIELDS.CONDITIONS}.${record.id}.excludeMeasures`,
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
                  measuringList={this.getExcludeMeasureList(
                    `${FIELDS.CONDITIONS}.${record.id}.measure`,
                    measureValue
                  )}
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Lựa chọn thông số sẽ loại bỏ"
                />
              )}
            </FormItem>
          )
        },
      },
      {
        title: '',
        align: 'center',
        render: (value, record, index) => {
          const { conditions } = this.state
          const { type } = this.props
          const isDisabled =
            type === 'create' ? conditions.length > 1 : index > 0
          return (
            <Button
              type="link"
              disabled={!isDisabled}
              onClick={() => this.deleteCondition(record.id)}
              style={{ marginBottom: '10px' }}
            >
              <Icon
                style={{
                  color: isDisabled ? '#E64D3D' : '#A2A7B3',
                }}
                type="delete"
              />
            </Button>
          )
        },
      },
    ]
  }

  render() {
    const { conditions, conditionsEdit } = this.state
    const { type } = this.props

    return (
      <TableCondition
        columns={this.getColumns()}
        rowKey={record => record.id}
        dataSource={type === 'create' ? conditions : conditionsEdit}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
        footer={() => (
          <Row type="flex" style={{ color: '#1890FF' }} align="middle">
            <Button
              type="link"
              style={{ fontWeight: 500, fontSize: '16px' }}
              onClick={this.addCondition}
            >
              <Icon type="plus" style={{ marginRight: 5 }} />
              Thêm điều kiện lọc
            </Button>
          </Row>
        )}
      />
    )
  }
}
