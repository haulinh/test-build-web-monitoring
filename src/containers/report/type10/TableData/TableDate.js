import { Col, Row, Table, Tabs } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import { translate } from 'hoc/create-lang'
import get from 'lodash/get'
import moment from 'moment'
import React from 'react'
import { i18n } from '../index'

const { TabPane } = Tabs

const TabStation = ({ data, loading }) => {
  return (
    <Tabs defaultActiveKey={get(data[0], 'station.key')}>
      {data.map(dataItem => {
        return (
          <TabPane
            tab={get(dataItem, 'station.name')}
            key={get(dataItem, 'station.key')}
          >
            {get(dataItem, 'station.activatedAt') && (
              <Row type="flex" justify="end">
                <Col>
                  <div style={{ fontWeight: 500 }}>
                    {i18n().header6}:{' '}
                    {moment(dataItem.station.activatedAt).format(DD_MM_YYYY)}
                  </div>
                </Col>
              </Row>
            )}
            <Clearfix height={8} />
            <TableDate
              dataSource={dataItem.data}
              loading={loading}
              dataFrequency={get(dataItem, 'station.dataFrequency')}
            />
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default TabStation

export function TableDate({ dataSource, loading, dataFrequency }) {
  const columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'center',
      render: value => {
        return (
          <div style={{ textAlign: 'right' }}>
            {moment(value).format(DD_MM_YYYY)}
          </div>
        )
      },
    },
    {
      title: i18n().header2,
      align: 'center',
      render: () => {
        return (
          <div style={{ textAlign: 'right' }}>
            {dataFrequency ? dataFrequency : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'totalDesign',
      align: 'center',
      render: value => {
        return <div style={{ textAlign: 'right' }}>{value ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'totalFact',
      align: 'center',
      render: value => {
        return <div style={{ textAlign: 'right' }}>{value ? value : '-'}</div>
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'ratio',
      align: 'center',
      render: value => {
        return <div style={{ textAlign: 'right' }}>{value ? value : '-'}</div>
      },
    },
  ]
  return (
    <Table
      loading={loading}
      size="small"
      rowKey="_id"
      columns={columns}
      bordered={true}
      dataSource={dataSource}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}
