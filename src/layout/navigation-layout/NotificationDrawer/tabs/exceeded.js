import React from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button} from 'antd'

const i18n = {
  station: '--- Trạm ---',
  parameters: '--- Các chỉ tiêu ---',
  gotoRealtimeMonitoringPage: 'Đến trang Xem chi tiết trạm',
  viewDataAroundThisTime: 'Xem giá trị quanh thời điểm vượt',
  exceeded: translate('stationStatus.exceeded'),
  exceededPreparing: translate('stationStatus.exceededPreparing'),
  errorData: '--- Du lieu truyen vao k dung dinh dang ---'
}

function Cell(props) {
  const { cellContent } = props

  const CustomRow = styled(Row)`
    margin-bottom: 8px
  `
  return (
    <CustomRow>
      <Card style={{ width: '100%' }} bodyStyle={{padding: 8}}>
        <CustomRow type="flex" justify="center">
          <Col span={12}>{cellContent.station}</Col>
          <Col span={12} style={{textAlign: "right"}}>{cellContent.exceededTime}</Col>
        </CustomRow>
        <CustomRow>
          <span style={{color: 'red'}}>{i18n.parameters}:</span>
          &nbsp;
          {_.join(cellContent.exceededParams, ', ')}
        </CustomRow>
        <CustomRow>
          <span style={{color: 'orange'}}>{i18n.parameters}:</span>
          &nbsp;
          {_.join(cellContent.exceededPreparingParams, ', ')}
        </CustomRow>
        <CustomRow type="flex" gutter={16}>
          <Col>
            <Button type="primary" ghost>{i18n.gotoRealtimeMonitoringPage}</Button>
          </Col>
          <Col>
            <Button type="primary" ghost>{i18n.viewDataAroundThisTime}</Button>
          </Col>
        </CustomRow>
      </Card>
    </CustomRow>
  )
}

function Cells(props) {
  const { dataSource } = props
  if(!_.isArray(dataSource)) return <div>{i18n.errorData}</div>
  return dataSource.map(cellContent => <Cell cellContent={cellContent}/>)
}

@connectAutoDispatch(
  (state) => ({
    dataSource: state.notification.logs.exceeded
  })
)
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    loadNotifications: propTypes.func.isRequired,
    tabKey: propTypes.string.isRequired,
    dataSource: propTypes.array.isRequired
  }

  static defaultProps = {}

  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.loadNotifications(1)
  }

  render() {
    const { dataSource } = this.props
    return (
      <Row>
        <Cells dataSource={dataSource}/>
        <Card loading />
      </Row>
    )
  }
}


