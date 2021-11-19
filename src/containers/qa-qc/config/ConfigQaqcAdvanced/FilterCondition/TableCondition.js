import { Button, Col, Form, Icon, Modal, Row, Table } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import React from 'react'
import FormData from './Form/FormData'

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

@Form.create()
class TableCondition extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
    }
    columns = [
        {
            title: '#',
            dataIndex: 'key',
            render: value => {
                return value
            },
        },
        {
            title: 'Tên điều kiện',
            dataIndex: 'conditionName',
            render: value => {
                return value
            },
        },
        {
            title: 'Trạm áp dụng',
            dataIndex: 'station',
            render: value => {
                return value
            },
        },
        {
            title: 'Thông số điều kiện',
            dataIndex: 'conditionMeasure',
            render: value => {
                return value
            },
        },
        {
            title: 'Thông số loại bỏ',
            dataIndex: 'measure',
            render: value => {
                return value
            },
        },
        {
            title: '',
            dataIndex: 'option',
            align: 'center',
            render: (value, index) => {
                return (
                    <div>
                        <Row type="flex" justify="center">
                            <div onClick={() => { this.setState({ visible: true }) }}><Icon style={{ color: '#1890FF' }} type="edit" /></div>
                            <Clearfix width={20} />
                            <Icon style={{ color: '#E64D3D' }} type="delete" />
                        </Row>
                    </div>
                )
            },
        },
    ]

    render() {
        const { form } = this.props;


        return (
            <React.Fragment>
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    footer={() => (
                        <div onClick={() => {
                            this.setState({ visible: true })
                        }}>
                            <Row type="flex">
                                <div style={{ marginRight: '10px' }}>
                                    <Icon type="plus" style={{ color: '#1890FF' }} />
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '500', color: '#1890FF' }}>
                                    Thêm điều kiện lọc
                                </div>
                            </Row>
                        </div>
                    )}
                />
                <Modal
                    title="Thêm điều kiện bộ lọc mới"
                    visible={this.state.visible}
                    onCancel={() => { this.setState({ visible: false }) }}
                    width={1060}
                    footer={[
                        <Row type="flex" justify="space-between">
                            <Col span={3}>
                                <Button key="back" type="danger">
                                    Xóa bộ lọc
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Row type="flex">
                                    <Button key="back">
                                        Nhập lại
                                    </Button>
                                    <Button key="submit" type="primary" >
                                        Cập nhật
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                    ]}
                >
                    <FormData form={form} />
                </Modal>
            </React.Fragment>
        )
    }
}

export default TableCondition
