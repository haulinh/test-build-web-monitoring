import { Empty, Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import moment from 'moment-timezone'
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getDurationTime } from 'utils/datetime'
import { translate as t } from 'hoc/create-lang'

const i18n = () => ({
  station: t('report.type1_exceed.table.station'),
  param: t('report.type1_exceed.table.param'),
  unit: t('report.type1_exceed.table.unit'),
  limit: t('report.type1_exceed.table.limit'),
  avg_value: t('report.type1_exceed.table.avg_value'),
  max_value: t('report.type1_exceed.table.max_value'),
  overtime: t('report.type1_exceed.table.overtime'),
  start_time: t('report.type1_exceed.table.start_time'),
  process_time: t('report.type1_exceed.table.process_time'),
  over_value: t('report.type1_exceed.table.over_value'),
  data_day: t('report.type1_exceed.table.data_day'),
})

const TableDataDate = ({ data, loading, ...props }) => {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }

  const dataSource = data.reduce((base, current, currentIndex) => {
    const dataStation = current.data.map((dataItem, index) => {
      return {
        ...dataItem,
        stationKey: current.station,
        key: `${current.station}-${dataItem.measure}`,
        ...(index === 0 && {
          spanMerge: current.data.length,
          indexMerge: true,
        }),
      }
    })
    return [...base, ...dataStation]
  }, [])
  const columnsExceed = [1, 2, 3].map(column => ({
    title: `${i18n().overtime} ${column}`,
    width: 300,
    children: [
      {
        title: i18n().start_time,
        width: 90,
        align: 'right',
        dataIndex: `data.${column - 1}`,
        render: value => {
          if (!value) return null
          return <div>{moment(value[0]).format(DD_MM_YYYY_HH_MM)}</div>
        },
      },
      {
        title: i18n().process_time,
        width: 120,
        align: 'right',
        dataIndex: `data.${column - 1}`,
        render: value => {
          if (!value) return null
          if (value[0] && value[1]) {
            const duration = getDurationTime(
              { from: value[0].time, to: value[1].time },
              props.lang
            )
            return <div>{duration}</div>
          }
        },
      },
      {
        title: i18n().over_value,
        width: 90,
        align: 'right',
        dataIndex: `data.${column - 1}`,
        render: value => {
          return <div>{_.get(value, '[0].value', '-')}</div>
        },
      },
    ],
  }))

  const columns = [
    {
      title: i18n().station,
      width: 120,
      align: 'left',
      fixed: 'left',
      dataIndex: 'stationKey',
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
    { title: i18n().param, width: 85, align: 'left', dataIndex: 'measure' },
    {
      title: i18n().unit,
      width: 70,
      align: 'left',
      dataIndex: 'config.unit',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: i18n().limit,
      width: 80,
      align: 'right',
      dataIndex: 'config',
      render: value => {
        if (!value.maxLimit) return null

        if (_.isNumber(value.maxLimit) && !_.isNumber(value.minLimit))
          return <div>{value.maxLimit}</div>

        return <div>{`${value.minLimit}-${value.maxLimit}`}</div>
      },
    },
    {
      title: i18n().data_day,
      width: 200,
      children: [
        {
          title: i18n().avg_value,
          width: 80,
          align: 'right',
          dataIndex: 'avg',
          render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
        },
        {
          title: i18n().max_value,
          width: 120,
          align: 'right',
          dataIndex: 'max',
          render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
        },
      ],
    },
    ...columnsExceed,
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
      scroll={{ x: 1100 }}
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

export default connect(mapStateToProps)(TableDataDate)
