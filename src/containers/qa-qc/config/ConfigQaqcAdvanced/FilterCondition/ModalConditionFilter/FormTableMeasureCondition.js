import React, { Component } from 'react'
import { Table, DatePicker, Row, Icon, Form, Col, Select, Input } from 'antd'

const { RangePicker } = DatePicker

@Form.create()
export default class FormTableMeasureCondition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isDeleteVisible: false,
            dataSource: [
                {
                    conditionMeasure: {
                        measure: 'ph',
                        sign: '<',
                        value: '7.05',
                    },
                    removeMeasure: ''
                }
            ],
        }
    }

    add = () => {
        const { form } = this.props
        // can use data-binding to get]
        const currentData = [...this.state.dataSource]
        const newData =
        {
            conditionMeasure: {
                measure: '',
                sign: '',
                value: '',
            },
            removeMeasure: ''
        }
        const newDataSource = [...currentData, newData]

        this.setState({ dataSource: newDataSource })
    }

    columns = [
        {
            title: 'Thông số điều kiện',
            dataIndex: 'conditionMeasure',
            width: 402,
            render: (value, index) => {
                const { form } = this.props
                return (
                    <Form>
                        <Row type="flex" gutter={12}>
                            <React.Fragment>
                                <Col span={12}>
                                    <Form.Item
                                        required={false}
                                    >
                                        {form.getFieldDecorator(`conditionMeasure[${index}].measure`, {
                                            validateTrigger: ['onChange', 'onBlur'],
                                        })(<Select defaultValue="pH" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        required={false}
                                    >
                                        {form.getFieldDecorator(`conditionMeasure[${index}].sign`, {
                                            validateTrigger: ['onChange', 'onBlur'],
                                        })(<Select defaultValue="<" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        required={false}
                                    >
                                        {form.getFieldDecorator(`conditionMeasure[${index}].value`, {
                                            validateTrigger: ['onChange', 'onBlur'],
                                        })(<Input defaultValue="7.05" />)}
                                    </Form.Item>
                                </Col>
                            </React.Fragment>
                        </Row>
                    </Form>
                )
            },
        },
        {
            title: 'Thông số loại bỏ',
            dataIndex: 'removeMeasure',
            render: value => {
                return <Select placeholder="Lựa chọn thông số sẽ loại bỏ" />
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
                    >
                        <Row type="flex">
                            <Icon style={{ color: '#E64D3D' }} type="delete" />
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
                    <div onClick={this.add}>
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
