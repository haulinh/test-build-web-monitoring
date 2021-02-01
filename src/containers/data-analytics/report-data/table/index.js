import { Table, Tooltip } from 'antd'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'

class DataTable extends Component {
  columns = lenght => [
    {
      key: 'index',
      title: t('roleManager.tableHeader.stt'),
      dataIndex: 'key',
      width: 60,
      render: (text, record, idx) => {
        if (idx < lenght) return <strong>{idx + 1}</strong>
        return null
      },
    },
    {
      key: 'station',
      title: t('stationAutoManager.list.title'),
      dataIndex: 'name',
      width: 250,
      render: name => name,
    },
  ]

  getDataSource = () => {
    const { data, qcvns } = this.props
    const measureKeys = Object.keys(data)
    const result = measureKeys.reduce((prev, measureKey) => {
      ;(data[measureKey] || []).forEach(item => {
        if (!prev[item.stationKey])
          prev[item.stationKey] = {
            key: item.stationKey,
            name: item.stationName,
            data: { [measureKey]: item.analyzeData },
          }
        else prev[item.stationKey].data[measureKey] = item.analyzeData
      })
      return prev
    }, {})
    return [...Object.values(result), ...qcvns]
  }

  render() {
    const { data, qcvns, dataType } = this.props
    const measureKeys = Object.keys(data)
    const dataSource = this.getDataSource()

    const getMeasuringValue = (list, key) => {
      const measure = list.find(item => item.key === key)
      const { minLimit, maxLimit } = measure || {}
      if ((minLimit || minLimit === 0) && (maxLimit || maxLimit === 0))
        return [minLimit, maxLimit].join('-')
      if (minLimit || minLimit === 0) return `≤ ${minLimit}`
      if (maxLimit || maxLimit === 0) return `≥ ${maxLimit}`
      return '-'
    }

    const columns = [
      ...this.columns(dataSource.length - qcvns.length),
      ...measureKeys.map(key => ({
        key,
        title: key,
        width: 100,
        render: (value, record, idx) =>
          idx < dataSource.length - qcvns.length ? (
            <Tooltip
              title={
                record.data[key]
                  ? record.data[key]['timeHaveMinValue'].join(',')
                  : null
              }
            >
              <div>{record.data[key] ? record.data[key][dataType] : '-'}</div>
            </Tooltip>
          ) : (
            <div>{getMeasuringValue(record.measuringList, key)}</div>
          ),
      })),
    ]

    console.log(qcvns)

    return (
      <Table
        key="key"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        scroll={{ x: 1000 }}
      />
    )
  }
}
export default DataTable
