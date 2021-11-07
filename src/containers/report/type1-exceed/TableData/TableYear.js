import { Empty, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

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
      title: 'QCVN',
      dataIndex: 'config.unit',
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
  return {
    lang: state.language.locale,
  }
}

export default connect(mapStateToProps)(TableYear)
