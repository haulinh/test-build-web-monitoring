import { Switch, Table } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

const obj = {
    text: "Text",
    category: "Category",
    number: "Number",
    datetime: "Date time"
}

export default function ConfigList({ configs, setEdit, handleChangeToggle }) {
    const columns = [
        {
            dataIndex: 'name',
            title: t('ticket.label.configProperties.name'),
            render: (value, record) => <div onClick={() => setEdit(record)}>{value}</div>
        },
        {
            dataIndex: 'type',
            title: t('ticket.label.configProperties.type'),
            render: (value, record) => <div onClick={() => setEdit(record)}>{obj[value]}</div>,
        },
        {
            dataIndex: 'hidden',
            title: t('ticket.label.configProperties.hidden'),
            render: (value, record) =>
                <Switch
                    defaultChecked={value}
                    onChange={(value) => handleChangeToggle(record._id, !value)}
                />,
        },
    ]

    return (
        <React.Fragment>
            <Table rowKey="_id" columns={columns} dataSource={configs} pagination={false} />
        </React.Fragment>
    )
}
