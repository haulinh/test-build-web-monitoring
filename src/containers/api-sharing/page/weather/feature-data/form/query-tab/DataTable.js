import { Table } from 'antd'
import { optionsWeather } from 'components/elements/select-data'
import { DD_MM_YYYY } from 'constants/format-date'
import { i18n } from 'containers/api-sharing/constants'
import { get, keyBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'

const DataTable = ({
  dataSource,
  loading,
  parameterList
}) => {
  let parameterListArray = parameterList
  if (!Array.isArray(parameterList)) parameterListArray = Array(parameterList)

  const columnsParameterList = parameterListArray.map(param => {
    const titleMap = optionsWeather.find(item => item.key === param)
    const title = `${titleMap.label} ${titleMap.unit && `(${titleMap.unit})`}`
    return {
      dataIndex: 'parameters',
      title: title,
      render: value => {
        const coverValue = keyBy(value, 'key')
        const getValue = get(coverValue, [param, 'value'], '-');

        let paramValue = (Math.round(getValue * 100) / 100).toFixed(2)

        if (param === 'wind_cdir_full') paramValue = i18n.windDirection[getValue]

        return (
          <div>{paramValue}</div>
        )
      },
    }
  })

  const columns = [
    {
      title: i18n.table.tt,
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      dataIndex: 'time',
      title: i18n.table.timeWeather,
      render: value => {
        const time = moment(value).format(DD_MM_YYYY)
        return <div> {time} </div>
      }
    },
    {
      dataIndex: 'weatherIcon',
      title: '',
      render: value => {
        return <img style={{ width: 50, height: 50 }} src={value.url} alt=""></img>
      }
    },
    ...columnsParameterList,
  ]

  return <Table columns={columns} dataSource={dataSource} loading={loading} />
}

export default DataTable
