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

const TabStationMonitoring = ({
  dataSource,
  stationKeys,
  stationAutos,
  onChangeTabStation,
  loading,
  tabKeyActive,
  measuresObj,
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

      <TableDateMonitoring
        measuresObj={measuresObj}
        loading={loading}
        dataSource={get(dataSource, ['0', 'data'])}
        station={get(dataSource, ['0', 'station'])}
      />
    </TabPane>
  ))

  return (
    <Tabs
      onChange={onChangeTabStation}
      defaultActiveKey={tabKeyActive}
      activeKey={tabKeyActive}
    >
      {tabPaneList}
    </Tabs>
  )
}

const TableDateMonitoring = ({ loading, dataSource, station, measuresObj }) => {
  const getDataSource = () => {
    const dataStation = dataSource.reduce((base, current) => {
      if (!current.logs) return []

      const dataMeasureKeys = Object.keys(get(current, 'logs'))
      const dataMeasuringLogs = dataMeasureKeys.map((measure, index) => {
        return {
          measure,
          date: current.date,
          key: current.date,
          ...current.logs[measure],
          ...(index === 0 && {
            spanMerge: dataMeasureKeys.length || 0,
            indexMerge: true,
          }),
        }
      })

      return [...base, ...dataMeasuringLogs]
    }, [])

    return {
      station,
      data: dataStation,
    }
  }

  const dataSourceTable = getDataSource()

  const columns = [
    {
      title: translate('dataSearchFilterForm.form.time'),
      dataIndex: 'date',
      align: 'left',
      width: '9%',
      render: (value, record) => {
        const obj = {
          children: <div>{value ? moment(value).format(DD_MM_YYYY) : '-'}</div>,
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    },
    {
      title: i18n().header2,
      align: 'right',
      width: '10%',
      render: (value, record) => {
        const obj = {
          children: (
            <div>
              {_.isNumber(station.dataFrequency) ? station.dataFrequency : '-'}
            </div>
          ),
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    },
    {
      title: i18n().table.title.measure,
      dataIndex: 'measure',
      align: 'left',
      width: '8%',
      render: value => {
        return <div>{measuresObj[value].name}</div>
      },
    },
    {
      title: i18n().table.title.valuesByDesign,
      dataIndex: 'total',
      align: 'right',
      width: '15%',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().table.title.valuesReceived,
      dataIndex: 'record',
      align: 'right',
      width: '15%',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().table.title.numberOfError,
      dataIndex: 'error',
      align: 'right',
      width: '15%',
      render: value => {
        return <div>{_.isNumber(value) ? value : '-'}</div>
      },
    },
    {
      title: i18n().table.title.percentageReceived,
      dataIndex: 'obtainedRatio',
      align: 'right',
      width: '14%',
      render: value => {
        return <div>{_.isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
      },
    },
    {
      title: i18n().table.title.percentageError,
      dataIndex: 'errorRatio',
      align: 'right',
      width: '14%',
      render: value => {
        return <div>{_.isNumber(value) ? getFormatNumber(value, 2) : '-'}</div>
      },
    },
  ]

  return (
    <Table
      loading={loading}
      size="small"
      rowKey={record => record.measure}
      columns={columns}
      bordered={true}
      dataSource={dataSourceTable.data}
      locale={{
        emptyText: translate('dataSearchFrom.table.emptyText'),
      }}
      pagination={false}
    />
  )
}

export default TabStationMonitoring
