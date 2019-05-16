import React from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button, message} from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router'
import { COLOR_STATUS } from 'themes/color';
import { loadNotificationsByType } from 'redux/actions/notification'

/* MARK  @translate */
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
          {/* MARK  @remove */}
          {/* <div dangerouslySetInnerHTML={<p>fdafdsafsa fda fjdsal; fjds fjs</p>} /> */}
          <div dangerouslySetInnerHTML={cellContent.fullBody}></div>
        </CustomParamsRow>
        {/* NOTE  đừng xóa, xem có thay đổi gì không */}
        {/* { cellContent.exceededParams.length !== 0 && (
          <CustomParamsRow>
            {i18n.parameters}
            &nbsp;
            <span style={{color: COLOR_STATUS.EXCEEDED}}>{i18n.exceeded}:</span>
            &nbsp;
            {_.join(cellContent.exceededParams, ', ')}
          </CustomParamsRow>
        )}
        { cellContent.exceededPreparingParams.length !== 0 && (
          <CustomParamsRow>
            {i18n.parameters}
            &nbsp;
            <span style={{color: COLOR_STATUS.EXCEEDED_PREPARING}}>{i18n.exceededPreparing}:</span>
            &nbsp;
            {_.join(cellContent.exceededPreparingParams, ', ')}
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
          <Col>
            <Button 
              type="primary" ghost 
              onClick={() => handleActionClick(cellContent.actions.aroundAtExceededTime)}>
              {i18n.viewDataAroundThisTime}
            </Button>
          </Col>
        </CustomRow>
      </Card>
    </CustomRow>
  )
}

function Cells(props) {
  const { dataSource } = props
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
    loading: state.notification.loading,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs.exceeded,
    isHasMoreExceed: state.notification.isHasMoreExceed,
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
    loading: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
  }

  static defaultProps = {}

  state = {
    defaultStartPage: 0
  }

  componentDidMount() {
    // const {tabName, stationAuto} = this.props
    // this.props.loadNotificationsByType(1, tabName, stationAuto)
  }

  render() {
    const { loading, defaultStartPage, dataSource, tabName, stationAuto } = this.props
    
    return (
      <InfiniteScroll
        initialLoad
        pageStart={this.state.defaultStartPage}
        hasMore={loading}
        threshold={500}
        loader={<Card key="loading" loading />}
        loadMore={(page) => this.props.loadNotificationsByType(page, tabName, stationAuto)}
        useWindow={false}>
          <Cells dataSource={dataSource} history={this.props.history} closeDrawer={this.props.closeDrawer}/>
      </InfiniteScroll>
    )
  }
}

