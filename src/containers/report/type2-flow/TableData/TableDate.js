import { Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import moment from 'moment-timezone'
import { FIELDS } from '../index'

function TableDate({ data, loading, form, measuresObj }) {
  if (_.isEmpty(data)) {
    return null
  }

  const dataSortByProvince = data.sort((a, b) =>
    _.get(b.station, 'province.key', '').localeCompare(
      _.get(a.station, 'province.key', '')
    )
  )

  const getUnitMeasure = () => {
    const measureSelected = form.getFieldValue(FIELDS.MEASURING_LIST)
    if (!measuresObj[measureSelected]) return

    const unitMeasure = measuresObj[measureSelected].unit
    return unitMeasure
  }

  const dataFlat = dataSortByProvince.reduce((base, current) => {
    if (_.isEmpty(current.data)) return base

    const dataStation = current.data.map(dataStationItem => {
      return {
        ...dataStationItem,
        station: current.station,
      }
    })
    return [...base, ...dataStation]
  }, [])

  const dataGroup = dataFlat.reduce((base, current) => {
    if (base.has(current._id)) {
      base.get(current._id).push(current)
      return base
    }

    base.set(current._id, [current])
    return base
  }, new Map())

  const dataSource = [...dataGroup].reduce(
    (base, [currentDate, currentData]) => {
      const dataDate = currentData.map((currentDataItem, index) => ({
        ...currentDataItem,
        ...(index === 0 && {
          date: currentDate,
          spanMerge: currentData.length,
          indexMerge: true,
        }),
      }))

      return [...base, ...dataDate]
    },
    []
  )

  const getTitleValue = () => {
    const unitMeasure = getUnitMeasure()
    if (!unitMeasure) return t('report.type2_flow.value')

    return `${t('report.type2_flow.value')} (${unitMeasure})`
  }

  const columns = [
    {
      title: t('report.type2_flow.time'),
      dataIndex: 'date',
      render: (value, record) => {
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
      title: t('report.type2_flow.stationName'),
      dataIndex: 'station.name',
    },
    //remove diameter
    // {
    //   title: t('report.type2_flow.diameter'),
    //   dataIndex: 'station.diameter',
    //   align: 'right',
    //   render: value => (_.isNumber(value) ? value : '-'),
    // },
    {
      title: getTitleValue(),
      dataIndex: 'value',
      align: 'right',
      render: value => <div>{!value ? '-' : value}</div>,
    },
  ]

  return (
    <Table
      loading={loading}
      bordered
      dataSource={dataSource.sort(
        (a, b) => moment(a._id, 'DD/MM/YYYY') - moment(b._id, 'DD/MM/YYYY')
      )}
      columns={columns}
      rowKey={row => `${row._id}-${row.station.key}`}
      pagination={false}
    />
  )
}

export default TableDate
