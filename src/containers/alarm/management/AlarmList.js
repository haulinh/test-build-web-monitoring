import { Table } from 'antd'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { i18n } from './form/AlarmForm'
import { alarmType } from './index'

const TableStyled = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`

const AlarmList = ({ data, loading, ...props }) => {
  const columns = [
    {
      dataIndex: 'stationId',
      title: i18n().form.label.station,
      render: value => (
        <div>{_.get(props.stationAutoById, `${value}.name`)}</div>
      ),
    },
    {
      dataIndex: 'name',
      title: i18n().form.label.name,
      render: value => <div>{value}</div>,
    },
    {
      dataIndex: 'type',
      title: i18n().form.label.type,
      render: value => <div>{alarmType[value].label}</div>,
    },
  ]

  return (
    <React.Fragment>
      <TableStyled
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </React.Fragment>
  )
}

const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return { stationAutoById }
}

export default connect(mapStateToProp)(AlarmList)
