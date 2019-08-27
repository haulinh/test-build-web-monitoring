import React from 'react'
import propTypes from 'prop-types'
// import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button} from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router'
// import { prop } from 'cramda';
// import { COLOR } from 'themes/color';
import { loadNotificationsByType } from 'redux/actions/notification'


const i18n = {
  gotoRealtimeMonitoringPage: translate('actions.gotoMonitoring'),
  exceeded: translate('stationStatus.exceeded'),
  exceededPreparing: translate('stationStatus.exceededPreparing'),
}

function Cell(props) {
  const { cellContent } = props

  const CustomRow = styled(Row)`
    margin-bottom: 8px
  `

  const CustomParamsRow = styled(Row)`
    margin-bottom: 8px;
    padding-left: 8px;
  `

  function handleActionClick(url) {
    props.history.push(url)
    props.closeDrawer()
  }

  return (
    <CustomRow>
      <Card style={{ width: '100%' }} bodyStyle={{padding: 8}}>
        <CustomRow type="flex" justify="center" align="middle">
          <Col span={12}>
            <strong>{cellContent.station}</strong>
          </Col>
          <Col span={12} style={{textAlign: "right", fontSize: 11}}>
            <i>{cellContent.exceededTime}</i>
          </Col>
        </CustomRow>
        <CustomParamsRow>
          <div dangerouslySetInnerHTML={cellContent.fullBody} />
        </CustomParamsRow>
        {/* NOTE  đừng xóa, xem có thay đổi gì không */}
        {/* { cellContent.status === "receivedSignal" && (
          <CustomParamsRow>
            <span style={{color: COLOR.GOOD}}>{cellContent.content}:</span>
          </CustomParamsRow>
        )}
        { cellContent.status === "lostSignal" && (
          <CustomParamsRow>
            <span style={{color: COLOR.DATA_LOSS}}>{cellContent.content}:</span>
          </CustomParamsRow>
        )} */}
        <CustomRow type="flex" gutter={16}>
          <Col>
          <Button 
            type="primary" ghost 
            onClick={() => handleActionClick(cellContent.actions.viewDetail)}>
            {i18n.gotoRealtimeMonitoringPage}
          </Button>
          </Col>
        </CustomRow>
      </Card>
    </CustomRow>
  )
}

function Cells(props) {
  const { dataSource } = props
  console.log('loadData datasource: ', dataSource)
  return dataSource.map((cellContent, index) => (
    <Cell
      key={index}
      cellContent={cellContent} 
      history={props.history} 
      closeDrawer={props.closeDrawer}
    />
  ))
}

@connectAutoDispatch(
  (state) => ({
    isLoadmoreLostSignal: state.notification.isLoadmoreLostSignal,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs.lostSignal,
    stationAuto: state.stationAuto.list
  }),
  {loadNotificationsByType}
)
@withRouter
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* component's props */
    tabName: propTypes.string.isRequired,
    loadNotifications: propTypes.func.isRequired,
    /* redux's props */
    stationAuto: propTypes.array.isRequired,
    isLoadmoreLostSignal: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
  }

  static defaultProps = {}

  state = {
    defaultStartPage: 1
  }

  componentDidMount() {
    const {tabName, stationAuto} = this.props
    const {defaultStartPage } = this.state
    this.props.loadNotificationsByType(defaultStartPage, tabName, stationAuto)
  }

  render() {
    const { isLoadmoreLostSignal, dataSource, tabName, stationAuto } = this.props
    return (
        <InfiniteScroll
          initialLoad={false} /* NOTE : không load chỗ này sẽ dẫn đến vòng lập vô hạn */
          pageStart={this.state.defaultStartPage}
          hasMore={isLoadmoreLostSignal}
          threshold={250}
          loader={<Card loading />}
          loadMore={(page) => this.props.loadNotificationsByType(page, tabName, stationAuto)}
          useWindow={false}>
          <Cells dataSource={dataSource} history={this.props.history} closeDrawer={this.props.closeDrawer}/>
        </InfiniteScroll>
    )
  }
}