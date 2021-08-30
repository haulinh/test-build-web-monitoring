import { Empty, Table, Tabs } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { i18n } from 'containers/api-sharing/constants'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'

const { TabPane } = Tabs

const valueMapKey = {
  dataType: {
    Dinh_trieu: 'Đỉnh triều',
    Chan_trieu: 'Chân triều',
  },
  dataSource: {
    Du_lieu_du_bao: 'Dữ liệu dự báo',
    Du_lieu_that: 'Dữ liệu thực tế',
  },
}

class TableStation extends React.Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
    },
  }
  measure = _.get(this.props.station, 'measuringList[0].name', '')
  unit = _.get(this.props.station, 'measuringList[0].unit', '')
  columns = [
    {
      title: '#',
      render: (_, __, index) => {
        const { current, pageSize } = this.state.pagination
        return <div>{(current - 1) * pageSize + (index + 1)}</div>
      },
    },
    {
      title: i18n.table.date,
      dataIndex: 'datetime',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
      render: value => {
        return <div>{moment(value).format(DD_MM_YYYY_HH_MM)}</div>
      },
    },
    {
      title: i18n.table.dataType,
      width: 120,
      align: 'center',
      dataIndex: 'dataType',

      render: value => {
        return <div>{valueMapKey.dataType[value]}</div>
      },
    },
    {
      title: `${this.measure} ${this.unit && `(${this.unit})`}`,
      align: 'center',
      width: 145,
      dataIndex: 'measureValue',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.table.alarmLevelI,
      align: 'center',
      width: 120,
      dataIndex: 'alarmLevelI',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.table.alarmLevelII,
      align: 'center',
      width: 120,
      dataIndex: 'alarmLevelII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.table.alarmLevelIII,
      align: 'center',
      width: 120,
      dataIndex: 'alarmLevelIII',
      render: value => {
        return <div>{value}</div>
      },
    },
    {
      title: i18n.table.dataSource,
      width: 130,
      align: 'center',
      dataIndex: 'dataSource',
      render: value => {
        return <div>{valueMapKey.dataSource[value]}</div>
      },
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
      <Table
        columns={this.columns}
        loading={loading}
        dataSource={data}
        pagination={pagination}
        onChange={this.handleOnChange}
      />
    )
  }
}

export default function TabResult({ data, loading }) {
  console.log({ data })
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={i18n.button.nodata}
      />
    )
  }

  const tabs = Object.keys(data)
  return (
    <div>
      <Tabs>
        {tabs.map(tabKey => (
          <TabPane tab={data[tabKey].station.name} key={tabKey}>
            <TableStation
              data={data[tabKey].data}
              station={data[tabKey].station}
              loading={loading}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
