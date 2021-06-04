import { Table, Tooltip } from 'antd'
import React, { Component } from 'react'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import moment from 'moment'
import { colorLevels, warningLevels } from 'constants/warningLevels'

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
      render: (name, item) => {
        if (item.isQCVN) {
          let startTime = item.begin
            ? moment(item.begin).format('DD/MM/YYYY') + ' - '
            : ''
          let endTime = item.expired
            ? moment(item.expired).format('DD/MM/YYYY')
            : t('qcvn.form.expired.isApplying')
          return <Tooltip title={startTime + endTime}>{name}</Tooltip>
        }
        return name
      },
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
    return [
      ...Object.values(result),
      ...qcvns.map(qc => ({
        ...qc,
        isQCVN: true,
      })),
    ]
  }

  render() {
    const { data, qcvns, dataType, measuringList } = this.props
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
        title: `${measuringList[key].name} ${
          measuringList[key].unit ? `(${measuringList[key].unit})` : ''
        }`,
        width: 100,
        render: (_, record, idx) => {
          if (idx < dataSource.length - qcvns.length) {
            // const warningLevel = record.data[key]
            //   ? record.data[key].warningLevel[dataType]
            //   : undefined

            return (
              <div
              // style={{
              //   color:
              //     warningLevel === warningLevels.EXCEEDED ||
              //     warningLevel === warningLevels.EXCEEDED_TENDENCY
              //       ? colorLevels[warningLevel]
              //       : undefined,
              // }}
              >
                {record.data[key] ? record.data[key][dataType] : '-'}
              </div>
            )
          }
          return <div>{getMeasuringValue(record.measuringList, key)}</div>
        },
      })),
    ]

    return (
      <Table
        key="key"
        bordered
        size="small"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        scroll={{ x: 1000 }}
      />
    )
  }
}
export default DataTable
