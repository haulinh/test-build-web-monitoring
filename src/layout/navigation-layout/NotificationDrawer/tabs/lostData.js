import React from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button, message} from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
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
        { cellContent.status === "receivedSignal" && (
          <CustomParamsRow>
            <span style={{color: COLOR_STATUS.GOOD}}>{cellContent.content}:</span>{/* MARK */}
          </CustomParamsRow>
        )}
        { cellContent.status === "lostSignal" && (
          <CustomParamsRow>
            <span style={{color: COLOR_STATUS.DATA_LOSS}}>{cellContent.content}:</span>{/* MARK */}
          </CustomParamsRow>
        )}
        <CustomRow type="flex" gutter={16}>
          <Col>
            <Button type="primary" ghost>{i18n.gotoRealtimeMonitoringPage}</Button>
          </Col>
        </CustomRow>
      </Card>
    </CustomRow>
  )
}

function Cells(props) {
  const { dataSource } = props
  console.log('loadData datasource: ', dataSource)
  return dataSource.map(cellContent => <Cell cellContent={cellContent}/>)
}

@connectAutoDispatch(
  (state) => ({
    loading: state.notification.loading,
    defaultStartPage: state.notification.defaultStartPage,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs.lostSignal
  }),
  {loadNotificationsByType}
)
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* component's props */
    loadNotifications: propTypes.func.isRequired,
    tabKey: propTypes.string.isRequired,
    /* redux's props */
    loading: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
  }

  static defaultProps = {}

  state = {
    page: 1,
  }

  componentDidMount() {
    this.props.loadNotifications(1)
  }

  render() {
    const { loading, defaultStartPage, currentPage, dataSource } = this.props
    return (
      <Row style={{height: '100%'}}>
        <InfiniteScroll
          // initialLoad
          pageStart={defaultStartPage}
          // hasMore={loading}
          threshold={250}
          // loader={<Card loading />}
          // loadMore={this.showInfo}
          useWindow={false}>
            <Cells dataSource={dataSource}/>
        </InfiniteScroll>
      </Row>
    )
  }

  showInfo = (page) => {
    message.info('This is a normal message');
    this.props.loadNotifications(page)
  }
}