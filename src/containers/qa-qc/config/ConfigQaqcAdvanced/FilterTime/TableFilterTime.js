import React, { Component } from 'react'
import { Table, Row, Icon, Button } from 'antd'

const data = [
  {
    key: '1',
    stationName: 'VINATEX TOMS',
    measure: 'pH, COD, NO2, NO3, TSS',
    status: 'outdate',
  },
  {
    key: '2',
    stationName: 'Hoàn kiếm',
    measure: 'pH, COD, NO2, NO3, TSS',
    status: 'apply',
  },
  {
    key: '3',
    stationName: 'TEST_QUI',
    measure: 'pH, COD, NO2, NO3, TSS',
    status: 'outdate',
  },
]

export default class TableFilterTime extends Component {
  columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 50,
      align: 'center',
    },
    {
      title: 'Trạm quan trắc',
      dataIndex: 'stationName',
      render: text => <div style={{ fontWeight: 500 }}>{text}</div>,
    },

    {
      title: 'Thông số',
      className: 'column-money',
      dataIndex: 'measure',
      align: 'left',
      render: value => <div style={{ color: '#1890ff' }}>{value}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: value => (
        <span>
          {value === 'outdate' && <div>Quá hạn</div>}
          {value === 'apply' && <div>Áp dụng</div>}
        </span>
      ),
    },
    {
      title: '',
      align: 'center',
      render: () => (
        <Row>
          <Button type="link" onClick={this.props.editRecord}>
            <Icon type="edit" style={{ color: '#1890FF' }} />
          </Button>
          <Button type="link" onClick={this.props.deleteRecord}>
            <Icon type="delete" style={{ color: 'red' }} />
          </Button>
        </Row>
      ),
    },
  ]

  render() {
    return (
      <Table
        columns={this.columns}
        bordered
        {...this.props}
        dataSource={data}
        pagination={false}
      />
    )
  }
}
