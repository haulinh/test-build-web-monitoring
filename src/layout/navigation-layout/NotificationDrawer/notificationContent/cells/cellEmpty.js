import React from 'react'
import _ from 'lodash'
import { Row, Col, Card, Button} from 'antd'

import { translate } from 'hoc/create-lang'

const i18n = {
  gotoRealtimeMonitoringPage: translate('actions.gotoMonitoring'),
  viewDataAroundThisTime: translate('actions.viewDataAroundThisTime'),
  exceeded: translate('stationStatus.exceeded'),
  exceededPreparing: translate('stationStatus.exceededPreparing'),
}

export default function EmptyCell(props) {
  return <div></div>
}