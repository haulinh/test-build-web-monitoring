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
      defaultActiveKey={stationKeys[0]}
      key={stationKeys.join(',')}
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
      render: (value, record) => {
        return <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>
      },
    },
    {
      title: i18n().header2,
      align: 'right',
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
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header4,
      dataIndex: 'record',
      align: 'right',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().header5,
      dataIndex: 'obtainedRatio',
      align: 'right',
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
