import { Table } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'

const i18n = () => ({
  happening: t('alarm.label.history.happening'),
  done: t('alarm.label.history.done'),
  disable: t('alarm.label.history.disable'),
  disconnect: t('alarm.alarmType.disconnect.label'),
  exceed: t('alarm.alarmType.exceed.label'),
  device: t('alarm.alarmType.device.label'),
  advance: t('alarm.alarmType.advance.label'),
})

const TableStyled = styled(Table)`
    .ant-table-row {
        :hover {
            cursor: pointer;
        }
    }
`
const mapStateToProp = state => {
  const stationAutoById = _.keyBy(state.stationAuto.list, '_id')
  return { stationAutoById }
}

@connect(mapStateToProp)
class TableAlarm extends React.Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
    },
  }

  columns = [
    {
      dataIndex: 'stationId',
      title: t('alarm.label.history.station'),
      render: (value, record) => <div>{_.get(this.props.stationAutoById, `${value}.name`)}</div>
    },
    {
      dataIndex: 'alarm',
      title: t('alarm.label.history.name'),
      render: (value, record) => <div>{_.get(value[0], 'name')}</div>,
    },
    {
      dataIndex: 'alarm',
      title: t('alarm.label.history.type'),
      render: (value, record) => <div>{i18n()[_.get(value[0], 'type')]}</div>
    },
    {
      dataIndex: 'createdAt',
      title: t('alarm.label.history.timeStart'),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      defaultSortOrder: 'ascend',
      render: (value, record) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
    },
    {
      dataIndex: 'status',
      title: t('alarm.label.history.status'),
      render: (value, record) =>
        <div style={{ color: value === 'happening' ? 'red' : 'gray' }}>{i18n()[value]}</div>
    },
  ]

  setPagination = pagination => {
    this.setState({ pagination })
  }

  handleOnChange = pagination => {
    this.setPagination(pagination)
  }

  render() {
    const { data, loading } = this.props
    const { pagination } = this.state
    return (
      <TableStyled
        columns={this.columns}
        loading={loading}
        dataSource={data}
        pagination={pagination}
        onChange={this.handleOnChange}
      />
    )
  }
}

export default TableAlarm