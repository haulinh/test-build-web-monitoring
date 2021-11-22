import { Button, Col, Form, Icon, Modal, Row, Table } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import React from 'react'
import ModalConditionFilter from './ModalConditionFilter'

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

class TableConditionFilter extends React.Component {
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

        return (
            <Table
                columns={this.columns}
                dataSource={dataSource}
                pagination={false}
                bordered
                {...this.props}
            />
        )
    }
}

export default TableConditionFilter
