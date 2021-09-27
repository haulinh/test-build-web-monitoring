import { Switch, Table } from 'antd'
import React from 'react'

export default function ConfigList({ form }) {

    const columns = [
        {
            dataIndex: 'name',
            title: "Tên thuộc tính",
            render: value => <div>{value}</div>,
        },
        {
            dataIndex: 'type',
            title: "Kiểu dữ liệu",
            render: value => <div>{value}</div>,
        },
        {
            dataIndex: 'hidden',
            title: "",
            render: value => <Switch>{value}</Switch>,
        },
    ]

    return (
        <React.Fragment>
            <Table columns={columns} dataSource={form} pagination={false} />
        </React.Fragment>
    )
}