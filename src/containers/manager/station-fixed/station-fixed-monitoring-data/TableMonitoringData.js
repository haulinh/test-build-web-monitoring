import { Row, Table } from 'antd'
import AvatarCharacter from 'components/elements/avatar-character'
import { translate as t } from 'hoc/create-lang'
import { get } from 'lodash'
import moment from 'moment-timezone'
import React from 'react'

const REPORT_LINK = 'https://qa.ilotusland.asia/'
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
            href={REPORT_LINK}
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
      dataIndex: 'type',
      align: 'left',
      key: 'typeInput',
      render: value => {
        return (
          <div>
            {value === 'manual'
              ? t('stationFixedManager.table.directInput')
              : t('stationFixedManager.table.title.excelInput')}
          </div>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.userInput'),
      dataIndex: 'createdBy',
      align: 'left',
      key: 'userInput',
      render: (value, record, index) => {
        return (
          <div>
            <Row type="flex" align="top">
              <div style={{ marginTop: '6px' }}>
                <AvatarCharacter
                  size={20}
                  height={20}
                  width={20}
                  username={value.firstName}
                  avatarUrl={value.avatar}
                />
              </div>
              <div style={{ marginLeft: '8px' }}>
                <Row>
                  {get(value, 'lastName', '') +
                    ' ' +
                    get(value, 'firstName', '')}
                </Row>
                <Row style={{ color: '#A2A7B3' }}>
                  {moment(record.createdAt).format('HH:MM DD/MM/YYYY')}
                </Row>
              </div>
            </Row>
          </div>
        )
      },
    },
    {
      title: t('stationFixedManager.table.title.editTime'),
      dataIndex: 'updatedBy',
      align: 'left',
      key: 'userInput',
      render: (value, record, index) => {
        return (
          <div>
            <Row type="flex" align="top">
              <div style={{ marginTop: '6px' }}>
                <AvatarCharacter
                  size={20}
                  height={20}
                  width={20}
                  username={value.firstName}
                  avatarUrl={value.avatar}
                />
              </div>
              <div style={{ marginLeft: '8px' }}>
                <Row>
                  {get(value, 'lastName', '') +
                    ' ' +
                    get(value, 'firstName', '')}
                </Row>
                <Row style={{ color: '#A2A7B3' }}>
                  {moment(record.updatedAt).format('HH:MM DD/MM/YYYY')}
                </Row>
              </div>
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
