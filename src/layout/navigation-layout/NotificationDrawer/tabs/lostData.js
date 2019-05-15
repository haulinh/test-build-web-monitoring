import React from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button, message} from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router'
import { prop } from 'cramda';
import { COLOR_STATUS } from 'themes/color';
import { loadNotificationsByType} from 'redux/actions/notification'


const i18n = {
  station: '--- Trạm ---',
  parameters: 'Các chỉ tiêu',
  gotoRealtimeMonitoringPage: 'Đến trang Xem chi tiết trạm',
  viewDataAroundThisTime: 'Xem giá trị quanh thời điểm vượt',
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
            <span style={{color: COLOR_STATUS.GOOD}}>{cellContent.content}:</span>
          </CustomParamsRow>
        )}
        { cellContent.status === "lostSignal" && (
          <CustomParamsRow>
            <span style={{color: COLOR_STATUS.DATA_LOSS}}>{cellContent.content}:</span>
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
    defaultStartPage: state.notification.defaultStartPage,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs.lostSignal
  }),
  {}
)
@withRouter
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* component's props */
    tabName: propTypes.string.isRequired,
    loadNotifications: propTypes.func.isRequired,
    /* redux's props */
    isLoadmoreLostSignal: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
  }

  static defaultProps = {}

  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.loadNotifications(1, this.props.tabName)
  }

  render() {
    const { isLoadmoreLostSignal, defaultStartPage, dataSource } = this.props
    return (
        <InfiniteScroll
          initialLoad={false}
          pageStart={defaultStartPage}
          hasMore={isLoadmoreLostSignal}
          threshold={250}
          loader={<Card loading />}
          loadMore={(page) => this.props.loadNotifications(page, this.props.tabName)}
          useWindow={false}>
          <Cells dataSource={dataSource} history={this.props.history} closeDrawer={this.props.closeDrawer}/>
        </InfiniteScroll>
    )
  }
}