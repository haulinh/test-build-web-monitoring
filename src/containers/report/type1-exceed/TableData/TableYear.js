import { Empty, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

const i18n = () => ({
  station: t('report.type1_exceed.table.station'),
  param: t('report.type1_exceed.table.param'),
  qcvn: t('report.type1_exceed.table.qcvn'),
  permiss_value: t('report.type1_exceed.table.permiss_value'),
  numday24h: t('report.type1_exceed.table.numday24h'),
  numday1h: t('report.type1_exceed.table.numday1h'),
  numrecord1h: t('report.type1_exceed.table.numrecord1h'),
  rate: t('report.type1_exceed.table.rate'),
})

const TableYear = ({ data, loading, ...props }) => {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }

  const dataSource = data.reduce((base, current) => {
    const stationDataArray = Object.entries(current.data)

    let dataStation = stationDataArray.map(
      ([measureKey, dataMeasure], index) => {
        return {
          ...dataMeasure,
          station: current.station,
          key: `${current.station.key}-${measureKey}`,
          measure: measureKey,
          ...(index === 0 && {
            station: current.station,
            spanMerge: stationDataArray.length,
            indexMerge: true,
          }),
        }
      }
    )
    const emptySign = '-'
    dataStation =
      dataStation.length > 0
        ? dataStation
        : [
          {
            station: current.station,
            key: `${current.station.key}`,
            measure: emptySign,
            spanMerge: 1,
            indexMerge: true,
          },
        ]

    return [...base, ...dataStation]
  }, [])

  console.log({ dataSource })

  const columns = [
    {
      title: i18n().station,
      dataIndex: 'station',
      width: 260,
      render: (value, record, index) => {
        const obj = {
          children: value.name,
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
      title: i18n().param, width: 90, render: (value, record) => {
        return _.get(record, 'qcvn.name', '-')
      }
    },
    {
      title: i18n().qcvn,
      dataIndex: 'station.standardsVN.name',
      render: (value, record, index) => {
        const obj = {
          children: value ? value : '-',
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
      title: i18n().permiss_value,
      dataIndex: 'qcvn',
      width: 70,
      align: 'right',
      render: qcvn => {
        if (!qcvn || !qcvn.maxLimit) return '-'

        if (_.isNumber(qcvn.maxLimit) && !_.isNumber(qcvn.minLimit))
          return <div>{qcvn.maxLimit}</div>

        return <div>{`${qcvn.minLimit}-${qcvn.maxLimit}`}</div>
      },
    },
    {
      title: i18n().numday24h,
      align: 'right',
      width: 120,
      dataIndex: 'numDay24hExceed',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().numday1h,
      align: 'right',
      width: 120,
      dataIndex: 'numDay1hExceed',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().numrecord1h,
      align: 'right',
      dataIndex: 'numRecord1hExceed',
      width: 110,
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().rate,
      align: 'right',
      width: 120,
      dataIndex: 'rate',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    // ...columnsExceed,
  ]

  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      bordered
      columns={columns}
      size="small"
      pagination={false}
      rowKey="key"
    />
  )
}

const mapStateToProps = state => {
  const stationAutoByKey = _.keyBy(state.stationAuto.list, 'key')
  return {
    lang: state.language.locale,
    stationAutoByKey,
  }
}

export default connect(mapStateToProps)(TableYear)
