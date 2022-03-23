import { Row, Table, Col } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

export default class TableMonitoringData extends React.Component {
  dataSource = [
    {
      order: 1,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 2,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 3,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 4,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 5,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 6,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 7,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 8,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 9,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
    {
      order: 10,
      phase: 'Đợt quan trắc 1',
      nameReport: 'Báo cáo QTĐK - MP1 161121',
      point: 'Nước mặt',
      typeInput: 'Excel',
      user: {
        name: 'User Name',
        time: '15:09 26/11/2021',
      },
      timeCreate: '21/2/2022',
      timeEdit: '21/2/2022',
    },
  ]

  columns = [
    {
      title: 'STT',
      dataIndex: 'order',
      align: 'center',
      key: 'order',
    },
    {
      title: t('stationFixedManager.table.title.phase'),
      dataIndex: 'phase',
      align: 'left',
      key: 'phase',
    },
    {
      title: t('stationFixedManager.table.title.reportName'),
      dataIndex: 'nameReport',
      align: 'left',
      key: 'nameReport',
      render: value => {
        return (
          <a
            href="https://qa.ilotusland.asia/"
            style={{ textDecoration: 'underline', color: '#111827' }}
          >
            {value}
          </a>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.point'),
      dataIndex: 'point',
      align: 'left',
      key: 'point',
    },
    {
      title: t('stationFixedManager.table.title.typeInput'),
      dataIndex: 'typeInput',
      align: 'left',
      key: 'typeInput',
    },
    {
      title: t('stationFixedManager.table.title.userInput'),
      dataIndex: 'user',
      align: 'left',
      key: 'userInput',
      render: value => {
        return (
          <div>
            <Row>
              <Col span={7}>
                <img src="/images/ilotusland-logo.svg" alt="ilotusland" />
              </Col>
              <Col span={17}>
                <Row style={{ color: '#111827' }}>{value.name}</Row>
                <Row style={{ color: '#A2A7B3' }}>{value.time}</Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.createTime'),
      dataIndex: 'user',
      align: 'left',
      key: 'userInput',
      render: value => {
        return (
          <div>
            <Row>
              <Col span={7}>
                <img src="/images/ilotusland-logo.svg" alt="ilotusland" />
              </Col>
              <Col span={17}>
                <Row style={{ color: '#111827' }}>{value.name}</Row>
                <Row style={{ color: '#A2A7B3' }}>{value.time}</Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.editTime'),
      dataIndex: 'user',
      align: 'left',
      key: 'userInput',
      render: value => {
        return (
          <div>
            <Row>
              <Col span={7}>
                <img src="/images/ilotusland-logo.svg" alt="ilotusland" />
              </Col>
              <Col span={17}>
                <Row style={{ color: '#111827' }}>{value.name}</Row>
                <Row style={{ color: '#A2A7B3' }}>{value.time}</Row>
              </Col>
            </Row>
          </div>
        )
      },
    },
  ]
  render() {
    return (
      <Table
        dataSource={this.dataSource}
        columns={this.columns}
        // rowKey="_id"
        bordered
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
      />
    )
  }
}
