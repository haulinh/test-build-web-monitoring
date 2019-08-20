import React from 'react'
import propTypes from 'prop-types'
// import _ from 'lodash'
import styled from 'styled-components'
import { translate } from 'hoc/create-lang'
import { connectAutoDispatch } from 'redux/connect'
import {Row, Col, Card, Button} from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router'
// import { COLOR_STATUS } from 'themes/color';
import { loadNotificationsByType } from 'redux/actions/notification'

import Cells from './cells'

@connectAutoDispatch(
  (state) => ({
    loading: state.notification.loading,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs,
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
    defaultStartPage: 1
  }

  componentDidMount() {
    const {tabName, stationAuto} = this.props
    const {defaultStartPage } = this.state
    this.props.loadNotificationsByType(defaultStartPage, stationAuto)
  }

  render() {
    const { loading, dataSource, tabName, stationAuto } = this.props
    
    return (
      <InfiniteScroll
        initialLoad={false} /* NOTE : không load chỗ này sẽ dẫn đến vòng lập vô hạn */
        pageStart={this.state.defaultStartPage}
        hasMore={loading}
        threshold={500}
        loader={<Card key="loading" loading />}
        loadMore={(page) => this.props.loadNotificationsByType(page, tabName, stationAuto)}
        useWindow={false}
       >
        <Cells 
          dataSource={dataSource} 
          history={this.props.history} 
          closeDrawer={this.props.closeDrawer}
        />
      </InfiniteScroll>
    )
  }
}

