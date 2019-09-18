import React from 'react'
import propTypes from 'prop-types'
// import _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import { Spin, Icon } from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import { withRouter } from 'react-router'
// import { COLOR_STATUS } from 'themes/color';
import { loadNotificationsByType } from 'redux/actions/notification'

import Cells from './cells'

function LoadMoreIcon() {
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  return (
    <div style={{textAlign: 'center', paddingTop: 16}}>
      <Spin indicator={antIcon} />
    </div>
  )
}

@connectAutoDispatch(
  (state) => ({
    loading: state.notification.loading,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs,
    stationAuto: state.stationAuto.list
  }),
  {loadNotificationsByType}
)
@withRouter
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* component's props */
    tabName: propTypes.string.isRequired,
    /* redux's props */
    stationAuto: propTypes.array.isRequired,
    loading: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
  }

  static defaultProps = {}

  state = {
    currentPage: 1
  }

  componentDidMount() {
    const { stationAuto, currentPage } = this.props
    this.props.loadNotificationsByType(currentPage, stationAuto)
  }

  render() {
    const { loading, dataSource, stationAuto, currentPage } = this.props
    
    return (
      <InfiniteScroll
        initialLoad={false} /* NOTE : không load chỗ này sẽ dẫn đến vòng lập vô hạn */
        pageStart={currentPage}
        hasMore={loading}
        threshold={1000}
        loader={<LoadMoreIcon />}
        loadMore={(page) => this.props.loadNotificationsByType(page, stationAuto)}
        useWindow={false}
      >
        <Cells 
          dataSource={dataSource}
          closeDrawer={this.props.closeDrawer}
        />
        
        {/* thêm khoảng trắng bên dưới để người dùng biết là hết */}
        <div style={{height: 100}}></div>
      </InfiniteScroll>
    )
  }
}

