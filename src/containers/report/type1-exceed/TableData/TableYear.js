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
    if (_.isEmpty(current.data)) return base

    const stationDataArray = Object.entries(current.data)
    const dataStation = stationDataArray.map(
      ([measureKey, dataMeasure], index) => {
        return {
          ...dataMeasure,
          stationKey: current.station,
          key: `${current.station}-${measureKey}`,
          measure: measureKey,
          ...(index === 0 && {
            station: current.station,
            spanMerge: stationDataArray.length,
            indexMerge: true,
          }),
        }
      }
    )
    return [...base, ...dataStation]
  }, [])

  const columns = [
    {
      title: i18n().station,
      dataIndex: 'stationKey.key',
      render: (value, record, index) => {
        const obj = {
          children: props.stationAutoByKey[value].name,
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
    { title: i18n().param, dataIndex: 'measure' },
    {
      title: i18n().qcvn,
      dataIndex: 'station.standardsVN.key',
      render: (value, record, index) => {
        const obj = {
          children: value,
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
      align: 'center',
      render: value => {
        if (!value.maxLimit) return null

        if (_.isNumber(value.maxLimit) && !_.isNumber(value.minLimit))
          return <div>{value.maxLimit}</div>

        return <div>{`${value.minLimit}-${value.maxLimit}`}</div>
      },
    },
    {
      title: i18n().numday24h,
      align: 'center',
      dataIndex: 'numDay24hExceed',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().numday1h,
      align: 'center',
      dataIndex: 'numDay1hExceed',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().numrecord1h,
      align: 'center',
      dataIndex: 'numRecord1hExceed',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().rate,
      align: 'center',
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
  const stationAutoByKey = _.keyBy(state.stationAuto.list,'key')
  return {
    lang: state.language.locale,
    stationAutoByKey,
  }
}

export default connect(mapStateToProps)(TableYear)
