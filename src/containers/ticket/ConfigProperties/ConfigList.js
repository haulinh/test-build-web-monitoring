import { Switch, Table } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

export default function ConfigList({ configs, setEdit }) {

    const columns = [
        {
            dataIndex: 'name',
            title: t('ticket.label.configProperties.name'),
            render: value => <div>{value}</div>,
        },
        {
            dataIndex: 'type',
            title: t('ticket.label.configProperties.type'),
            render: value => <div>{value}</div>,
        },
        {
            dataIndex: 'hidden',
            title: "",
            render: value => <Switch checked={value} />,
        },
    ]

    return (
        <React.Fragment>
            <Table rowKey="_id" columns={columns} dataSource={configs} pagination={false}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setEdit(record)
                        },
                    }
                }}
            />
        </React.Fragment>
    )
}
