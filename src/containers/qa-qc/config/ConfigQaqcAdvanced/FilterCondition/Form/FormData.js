import { Col, Form, Icon, Input, Row, Select, Table } from 'antd'
import SelectStationAuto from 'components/elements/select-station-auto'
import SelectStationType from 'components/elements/select-station-type'
import React from 'react'
import ModalConfirm from 'containers/qa-qc/config/ConfigQaqcAdvanced/components/ModalConfirm'

const FIELDS = {
    FILTER_NAME: 'filterName',
    STATION_TYPE: 'stationType',
    STATION: 'station',
}

const dataSource = [
    {
        key: '01',
        conditionName: 'Flow tăng cao',
        station: 'Trạm A',
        conditionMeasure: 'Flow = 0',
        measure: 'pH, No2, TSS',
    },
    {
        key: '02',
        station: 'Trạm A',
        conditionMeasure: 'Flow = 0',
        conditionName: 'pH, No2',
        measure: 'pH, No2, TSS',
    },
    {
        key: '03',
        conditionName: 'pH, No2',
        conditionMeasure: 'Flow = 0',
        station: 'Trạm A',
        measure: 'pH, No2, TSS',
    },
]

let id = 0

class FormData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isDeleteVisible: false,
            measures: [],
        }
    }
    add = () => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        })
    }

    remove = k => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        // We need at least one passenger
        if (keys.length === 1) {
            return
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        })
    }

    columns = [
        {
            title: 'Thông số điều kiện',
            dataIndex: 'conditionMeasure',
            width: 402,
            render: value => {
                const { getFieldDecorator, getFieldValue } = this.props.form
                const formItemLayout = {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 4 },
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 20 },
                    },
                }
                const formItemLayoutWithOutLabel = {
                    wrapperCol: {
                        xs: { span: 24, offset: 0 },
                        sm: { span: 20, offset: 4 },
                    },
                }
                getFieldDecorator('keys', { initialValue: [] })

                const keys = getFieldValue('keys')
                const formItems = keys.map((k, index) => (
                    <React.Fragment>
                        <Col span={12}>
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                                {getFieldDecorator(`names[${k}]`, {
                                    validateTrigger: ['onChange', 'onBlur'],
                                })(<Select defaultValue="pH" />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                                {getFieldDecorator(`names[${k}]`, {
                                    validateTrigger: ['onChange', 'onBlur'],
                                })(<Select defaultValue="<" />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                required={false}
                                key={k}
                            >
                                {getFieldDecorator(`names[${k}]`, {
                                    validateTrigger: ['onChange', 'onBlur'],
                                })(<Input defaultValue="7.05" />)}
                            </Form.Item>
                        </Col>
                    </React.Fragment>
                ))
                return (
                    <Form>
                        <Row type="flex" gutter={12}>
                            {formItems}
                        </Row>
                    </Form>
                )
            },
        },
        {
            title: 'Thông số loại bỏ',
            dataIndex: 'measure',
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
        const { form } = this.props

        return (
            <Form>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item label="Tên bộ lọc">
                            {form.getFieldDecorator(FIELDS.FILTER_NAME, {
                                initialValue: 'Tên bộ lọc',
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Loại trạm">
                            {form.getFieldDecorator(FIELDS.STATION_TYPE, {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<SelectStationType />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Trạm quan trắc">
                            {form.getFieldDecorator(FIELDS.STATION, {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<SelectStationAuto />)}
                        </Form.Item>
                    </Col>
                    <Row>
                        <Table
                            columns={this.columns}
                            dataSource={dataSource}
                            pagination={false}
                            bordered
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
                        <ModalConfirm isVisible={this.state.isDeleteVisible} />
                    </Row>
                </Row>
            </Form>
        )
    }
}

export default FormData
