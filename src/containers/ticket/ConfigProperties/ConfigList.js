import { Switch, Table } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'

const obj = {
    text: "Text",
    category: "Category",
    number: "Number",
    datetime: "Date time"
}

const TableStyled = styled(Table)`
    .ant-table-row {
        :hover {
            cursor: pointer;
        }
    }
`
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
                    onChange={(value) => handleChangeToggle(record._id, value)}
                />,
        },
    ]

    return (
        <React.Fragment>
            <TableStyled
                rowKey="_id"
                columns={columns}
                dataSource={configs}
                pagination={false}
            />
        </React.Fragment>
    )
}
