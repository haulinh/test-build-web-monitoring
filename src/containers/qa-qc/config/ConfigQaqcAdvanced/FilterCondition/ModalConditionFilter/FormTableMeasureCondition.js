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
    excludeMeasureList: [],
  }

  componentDidMount() {
    const { type, form, data } = this.props
    if (type === 'edit') {
      this.setState({ conditions: data.conditions }, () => {
        form.setFieldsValue({ [FIELDS.CONDITIONS]: data.conditions })
      })
    }
    console.log({ didMount: data.conditions })
  }

  componentDidUpdate(prevProps, prevState) {
    const { type, form, data } = this.props
    if (type === 'edit' && prevProps.data._id !== data._id) {
      this.setState({ conditions: data.conditions }, () => {
        form.setFieldsValue({ [FIELDS.CONDITIONS]: data.conditions })
      })
      console.log({ didUpdate: data.conditions })
    }
  }

  addCondition = () => {
    const { conditions } = this.state
    const newData = {
      id: uuidv4(),
    }
    const newConditions = [...conditions, newData]

    this.setState({ conditions: newConditions })
  }

  deleteCondition = id => {
    const { conditions } = this.state
    const newConditions = conditions.filter(
      conditionItem => conditionItem.id !== id
    )
    this.setState({ conditions: newConditions })
  }

  handleConditionMeasureChange = (value, excludeMeasuresField) => {
    const { measureList, form } = this.props
    form.resetFields(excludeMeasuresField)
    const newMeasureList = measureList.filter(measure => measure.key !== value)
    this.setState({ excludeMeasureList: newMeasureList })
  }

  getColumns = () => {
    return [
      {
        title: 'Thông số điều kiện',
        width: 402,
        render: (value, record, index) => {
          const { form, measureList } = this.props
          const excludeMeasuresField = `${FIELDS.CONDITIONS}.${index}.excludeMeasures`

          return (
            <Row type="flex" align="middle" gutter={12}>
              <Col span={12}>
                <FormItem required={false} marginBottom="12px">
                  {form.getFieldDecorator(
                    `${FIELDS.CONDITIONS}.${index}.measure`,
                    {
                      onChange: value => {
                        this.handleConditionMeasureChange(
                          value,
                          excludeMeasuresField
                        )
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
                    `${FIELDS.CONDITIONS}.${index}.operator`,
                    {
                      initialValue: 'eq',
                    }
                  )(<SelectOperator />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem required={false} marginBottom="12px">
                  {form.getFieldDecorator(
                    `${FIELDS.CONDITIONS}.${index}.value`,
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
          const { excludeMeasureList } = this.state
          return (
            <FormItem required={false} marginBottom="12px">
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
                  measuringList={excludeMeasureList}
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
          const isDisabled = conditions.length > 1
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
    const { conditions } = this.state
    console.log({ conditions })
    const { type, data, form, ...otherProps } = this.props

    console.log({ formValue: form.getFieldsValue() })
    return (
      <TableCondition
        columns={this.getColumns()}
        dataSource={conditions}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
        footer={() => (
          <Button type="link" onClick={this.addCondition}>
            <Row type="flex" align="middle">
              <Col style={{ marginRight: '8px', marginTop: '2px' }}>
                <Icon type="plus" style={{ color: '#1890FF' }} />
              </Col>
              <Col>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#1890FF',
                  }}
                >
                  Thêm điều kiện lọc
                </span>
              </Col>
            </Row>
          </Button>
        )}
      />
    )
  }
}
