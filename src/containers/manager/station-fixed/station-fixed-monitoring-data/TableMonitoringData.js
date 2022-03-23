import { Row, Table, Col } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment-timezone'

export default class TableMonitoringData extends React.Component {
  columns = [
    {
      title: '#',
      dataIndex: '',
      align: 'center',
      key: 'order',
      render: (value, record, index) => {
        return <div>{index + 1}</div>
      },
    },
    {
      title: t('stationFixedManager.table.title.reportName'),
      dataIndex: 'name',
      align: 'left',
      key: 'name',
      render: value => {
        return (
          <a
            href="https://qa.ilotusland.asia/"
            style={{
              textDecoration: 'underline',
              color: 'rgba(0, 0, 0, 0.65)',
            }}
          >
            {value}
          </a>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.point'),
      dataIndex: 'station.name',
      align: 'left',
      key: 'point',
    },
    {
      title: t('stationFixedManager.table.title.typeInput'),
      dataIndex: 'typeInput',
      align: 'left',
      key: 'typeInput',
      render: value => {
        return <div>Nhập trực tiếp</div>
      },
    },
    {
      title: t('stationFixedManager.table.title.userInput'),
      dataIndex: 'createdById',
      // dataIndex: 'createdBy',
      align: 'left',
      key: 'userInput',
      render: (value, record, index) => {
        return (
          <div>
            <Row type="flex" justify="start">
              <Col span={3}>
                <img
                  width={20}
                  height={20}
                  src="/images/ilotusland-logo.svg"
                  alt="ilotusland"
                />
                {/* <img src={value.avatar} alt="ilotusland" /> */}
              </Col>
              <Col span={21}>
                <Row>{value}</Row>
                {/* <Row style={{ color: '#111827' }}>{value.lastName + ' ' + value.firstName}</Row> */}
                <Row style={{ color: '#A2A7B3' }}>
                  {moment(record.createdAt).format('HH:MM DD/MM/YYYY')}
                </Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.editTime'),
      dataIndex: 'updatedById',
      // dataIndex: 'updatedBy',
      align: 'left',
      key: 'userInput',
      render: (value, record, index) => {
        return (
          <div>
            <Row type="flex" justify="start">
              <Col span={3}>
                <img
                  width={20}
                  height={20}
                  src="/images/ilotusland-logo.svg"
                  alt="ilotusland"
                />
                {/* <img src={value.avatar} alt="ilotusland" /> */}
              </Col>
              <Col span={21}>
                <Row>{value}</Row>
                {/* <Row style={{ color: '#111827' }}>{value.lastName + ' ' + value.firstName}</Row> */}
                <Row style={{ color: '#A2A7B3' }}>
                  {moment(record.updatedAt).format('HH:MM DD/MM/YYYY')}
                </Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
  ]
  render() {
    const { dataSource, loading } = this.props
    const dataSourceSort = dataSource.sort(function(a, b) {
      return moment(b.createdAt) - moment(a.createdAt)
    })

    return (
      <Table
        dataSource={dataSourceSort}
        columns={this.columns}
        rowKey={record => record._id}
        bordered
        loading={loading}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
      />
    )
  }
}
