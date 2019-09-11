import React from 'react'
import { List } from 'antd'
import { NOTIFY_TYPE } from 'constants/notification'

import { default as SensorErrorCell } from './cellSensorError'
import { default as SensorGoodCell } from './cellSensorGood'
import { default as DataLossCell } from './cellDataLoss'
import { default as DataConnectedCell } from './cellDataConnected'
import { default as DataExceededCell } from './cellDataExceeded'
import { default as DataExceededPreparedCell } from './cellDataExceededPrepared'
import { default as EmptyCell } from './cellEmpty'

export default function Cells(props) {
  const { dataSource } = props
  let cells =  dataSource.map((cellContent) => {
    console.log('---- cell content ----', cellContent)
    let Cell = EmptyCell
    switch (cellContent.status) {
      case NOTIFY_TYPE.SENSOR_GOOD: 
        Cell = SensorGoodCell
        break
      case NOTIFY_TYPE.SENSOR_ERROR: 
        Cell = SensorErrorCell
        break
      case NOTIFY_TYPE.DATA_CONNECTED: 
        Cell = DataConnectedCell
        break
      case NOTIFY_TYPE.DATA_EXCEEDED: 
        Cell = DataExceededCell
        break
      case NOTIFY_TYPE.DATA_EXCEEDED_PREPARED: 
        Cell = DataExceededPreparedCell
        break
      case NOTIFY_TYPE.DATA_LOSS: 
        Cell = DataLossCell
        break
      default: break;
    }

    return <Cell cellContent={cellContent} key={cellContent._id}/>
  })


  return (
    <List
      dataSource={cells}
      renderItem={item => item}
    >

    </List>
  )
}
