import { Table, Tabs, Row, Col } from 'antd'
import { Clearfix } from 'components/layouts/styles'
import { DD_MM_YYYY } from 'constants/format-date'
import { getFormatNumber } from 'constants/format-number'
import { translate } from 'hoc/create-lang'
import _, { get } from 'lodash'
import moment from 'moment'
import React from 'react'
import { i18n } from '../../constants'

const { TabPane } = Tabs

const TabStationObtained = ({
  dataSource,
  stationKeys,
  stationAutos,
  tabKeyActive,
  onChangeTabStation,
  loading,
}) => {
  const stationAutoByKey = _.keyBy(stationAutos, 'key')
  const activatedAt = _.get(dataSource, ['0', 'station', 'activatedAt'])

  const tabPaneList = stationKeys.map(stationKey => (
    <TabPane tab={stationAutoByKey[stationKey].name} key={stationKey}>
      <Row type="flex" justify="end">
        <Col>
          <div style={{ fontWeight: 500 }}>
            {i18n().header6}:{' '}
            {activatedAt
              ? moment(activatedAt).format(DD_MM_YYYY)
              : translate('report.typeRatio.notUpdate')}
          </div>
        </Col>
      </Row>
      <Clearfix height={8} />

      <TableDateObtained
        loading={loading}
        dataSource={get(dataSource, ['0', 'data'])}
        station={get(dataSource, ['0', 'station'])}
      />
    </TabPane>
  ))

  return (
    <Tabs
      defaultActiveKey={tabKeyActive}
      activeKey={tabKeyActive}
      onChange={onChangeTabStation}
    >
      {tabPaneList}
    </Tabs>
  )
}

const TableDateObtained = ({ loading, dataSource, station }) => {
  const columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'left',
      width: '20%',
      render: (value, record) => {
        return <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>
      },
    },
    {
      title: i18n().header2,
      align: 'right',
      width: '20%',
      render: () => {
        return (
          <div>
            {_.isNumber(station.dataFrequency) ? station.dataFrequency : '-'}
          </div>
        )
      },
    },
    {
      title: i18n().header3,
      dataIndex: 'total',
      width: '20%',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'record',
      align: 'right',
      width: '20%',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'obtainedRatio',
      align: 'right',
      width: '20%',
      render: value => {
        return <div>{getFormatNumber(value, 2)}</div>
      },
    },
  ]

  return (
    <Table
      loading={loading}
      size="small"
      rowKey={record => record.date}
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

export default TabStationObtained
