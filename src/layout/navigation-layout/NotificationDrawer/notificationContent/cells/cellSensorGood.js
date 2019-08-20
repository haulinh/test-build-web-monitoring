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

export default function SensorGoodCell(props) {
  const { cellContent } = props

  function handleActionClick(url) {
    props.history.push(url)
    props.closeDrawer()
  }
  console.log(cellContent, "cellContent")
  return (
    <Row style={{padding: 8}}>
      <Col>fda;f</Col>
      <Col>fdaf</Col>
      {/* <CustomRow type="flex" justify="center" align="middle">
      <Col span={12}>
        <strong>{cellContent.station}</strong>
      </Col>
      <Col span={12} style={{textAlign: "right", fontSize: 11}}>
        <i>{cellContent.exceededTime}</i>
      </Col>
    </CustomRow>
    <CustomParamsRow>
      <div dangerouslySetInnerHTML={cellContent.fullBody}></div>
    </CustomParamsRow>
    
    <CustomRow type="flex" gutter={16}>
      <Col>
        <Button 
          type="primary" ghost 
          onClick={() => handleActionClick(cellContent.actions.viewDetail)}>
          {i18n.gotoRealtimeMonitoringPage}
        </Button>
      </Col>
      <Col>
        <Button 
          type="primary" ghost 
          onClick={() => handleActionClick(cellContent.actions.aroundAtExceededTime)}>
          {i18n.viewDataAroundThisTime}
        </Button>
      </Col>
    </CustomRow> */}
    </Row>
  )
}