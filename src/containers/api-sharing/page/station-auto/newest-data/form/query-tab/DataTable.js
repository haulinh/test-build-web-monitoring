import { Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { i18n } from 'containers/api-sharing/constants'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import { get, keyBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'
import { DATA_COLOR } from 'themes/color'

// const DataTable = ({
//   measuringList = [],
//   dataSource,
//   loading,
//   stationAutos,
// }) => {
//   const measureListData = keyBy(
//     getMeasuringListFromStationAutos(stationAutos),
//     'key'
//   )

//   let measuringListArray = measuringList
//   if (!Array.isArray(measuringList)) measuringListArray = Array(measuringList)

//   const columnsMeasuringList = measuringListArray.map(measure => {
//     const measureData = measureListData[measure]
//     const title = measureData
//       ? `${measureData.name} ${measureData.unit && `(${measureData.unit})`}  `
//       : '-'
//     return {
//       dataIndex: 'measuringLogs',
//       title,
//       render: value => {
//         const measureValue = get(value, [measure, 'value'])
//         const warningLevel = get(value, [measure, 'warningLevel'], '')
//         return (
//           <div style={{ color: DATA_COLOR[warningLevel] }}>
//             {measureValue ? measureValue.toFixed(2) : '-'}
//           </div>
//         )
//       },
//     }
//   })

//   const columns = [
//     {
//       title: i18n.table.tt,
//       render: (_, __, index) => <div>{index + 1}</div>,
//     },
//     {
//       dataIndex: 'receivedAt',
//       title: i18n.table.time,
//       render: value => {
//         const time = moment(value).format(DD_MM_YYYY_HH_MM)
//         return <div>{time}</div>
//       },
//     },
//     {
//       title: i18n.table.stationName,
//       dataIndex: 'name',
//       render: value => <div>{value}</div>,
//     },
//     ...columnsMeasuringList,
//   ]

//   const handleOnchange = pagination => {
//     console.log({ pagination })
//   }

//   return (
//     <Table
//       columns={columns}
//       dataSource={dataSource}
//       loading={loading}
//       onChange={handleOnchange}
//     />
//   )
// }

// export default withApiSharingDetailContext(DataTable)

@withApiSharingDetailContext
export default class DataTable extends React.Component {
  state = {}

  getColumnsMeasuringList = () => {
    const { measuringList = [] } = this.props
    const measureListData = keyBy(
      getMeasuringListFromStationAutos(this.props.stationAutos),
      'key'
    )
    let measuringListArray = measuringList
    if (!Array.isArray(measuringList)) measuringListArray = Array(measuringList)

    const columnsMeasuringList = measuringListArray.map(measure => {
      const measureData = measureListData[measure]
      const title = measureData
        ? `${measureData.name} ${measureData.unit && `(${measureData.unit})`}  `
        : '-'
      return {
        dataIndex: 'measuringLogs',
        title,
        render: value => {
          const measureValue = get(value, [measure, 'value'])
          const warningLevel = get(value, [measure, 'warningLevel'], '')
          return (
            <div style={{ color: DATA_COLOR[warningLevel] }}>
              {measureValue ? measureValue.toFixed(2) : '-'}
            </div>
          )
        },
      }
    })

    return columnsMeasuringList
  }

  columnsFixed = [
    {
      title: i18n.table.tt,
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      dataIndex: 'receivedAt',
      title: i18n.table.time,
      render: value => {
        const time = moment(value).format(DD_MM_YYYY_HH_MM)
        return <div>{time}</div>
      },
    },
    {
      title: i18n.table.stationName,
      dataIndex: 'name',
      render: value => <div>{value}</div>,
    },
  ]

  handleOnchange = pagination => {
    console.log({ pagination })
  }

  render() {
    const { dataSource, loading } = this.props
    const columnsMeasuringList = this.getColumnsMeasuringList()
    const columns = [...this.columnsFixed, ...columnsMeasuringList]
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={this.handleOnchange}
      />
    )
  }
}
