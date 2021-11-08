import { Empty, Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import moment from 'moment-timezone'
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getDurationTime } from 'utils/datetime'
import { translate as t } from 'hoc/create-lang'

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
    title: `Vượt ngưỡng lần ${column}`,
    children: [
      {
        title: 'Thời điểm phát sinh',
        dataIndex: `data.${column - 1}`,
        render: value => {
          if (!value) return null
          return <div>{moment(value[0]).format(DD_MM_YYYY_HH_MM)}</div>
        },
      },
      {
        title: 'Thời gian xử lý',
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
        title: 'Giá trị vượt ngưỡng',
        dataIndex: `data.${column - 1}`,
        render: value => {
          return <div>{_.get(value, '[0].value', '-')}</div>
        },
      },
    ],
  }))

  const columns = [
    {
      title: 'Trạm quan trắc',
      dataIndex: 'stationKey',
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
    { title: 'Thông số', dataIndex: 'measure' },
    {
      title: 'Đơn vị',
      dataIndex: 'config.unit',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    {
      title: 'Giá trị giới hạn',
      dataIndex: 'config',
      render: value => {
        if (!value.maxLimit) return null

        if (_.isNumber(value.maxLimit) && !_.isNumber(value.minLimit))
          return <div>{value.maxLimit}</div>

        return <div>{`${value.minLimit}-${value.maxLimit}`}</div>
      },
    },
    {
      title: 'Số liệu trong ngày',
      children: [
        {
          title: 'Giá trị TB',
          dataIndex: 'avg',
          render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
        },
        {
          title: 'Giá trị lớn nhất',
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
    />
  )
}

const mapStateToProps = state => {
  return {
    lang: state.language.locale,
  }
}

export default connect(mapStateToProps)(TableDataDate)
