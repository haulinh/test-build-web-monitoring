import React from 'react'
import propTypes from 'prop-types'
import _ from 'lodash'
import { connectAutoDispatch } from 'redux/connect'
import { Spin, Icon, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import { withRouter } from 'react-router'
// import styled from 'styled-components'
// import { COLOR_STATUS } from 'themes/color';
import {
  loadNotificationsByType,
  clearLoadNotificationsByType,
} from 'redux/actions/notification'
// import { translate } from 'hoc/create-lang'

import Cells from './cells'

// const NotificationSearchWrapper = styled.div`
//   padding: 16px;
// `

// const { Search } = Input

function LoadMoreIcon() {
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
  return (
    <div style={{ textAlign: 'center', paddingTop: 16 }}>
      <Spin indicator={antIcon} />
    </div>
  )
}

// const i18n = {
//   timKiem: translate('addon.searchNotification'),
// }

@connectAutoDispatch(
  state => ({
    loading: state.notification.loading,
    currentPage: state.notification.currentPage,
    dataSource: state.notification.logs,
    stationAuto: state.stationAuto.list,
  }),
  { loadNotificationsByType, clearLoadNotificationsByType }
)
@withRouter
export default class NotificationContent extends React.Component {
  static propTypes = {
    /* component's props */
    // tabName: propTypes.string.isRequired,
    isEmptyNotification: propTypes.bool,
    closeDrawer: propTypes.func,
    /* redux's props */
    stationAuto: propTypes.array.isRequired,
    loading: propTypes.bool.isRequired,
    currentPage: propTypes.number.isRequired,
    dataSource: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
    clearLoadNotificationsByType: propTypes.func,
    inline: propTypes.bool
  }

  static defaultProps = {}

  state = {
    currentPage: 1,
    txtSearch: undefined,
    isSearchLoading: false,
  }

  componentDidMount() {
    const { stationAuto, currentPage } = this.props
    this.props.loadNotificationsByType(
      currentPage,
      stationAuto,
      this.state.txtSearch
    )
  }

  handleOnChange = _.debounce(value => {
    const {
      stationAuto,
      // , currentPage
    } = this.props

    this.setState(
      {
        txtSearch: value,
        isSearchLoading: false,
      },
      () => {
        this.props.loadNotificationsByType(1, stationAuto, this.state.txtSearch)
      }
    )
  }, 300)

  render() {
    const {isSearchLoading} = this.state
    const { loading, dataSource, stationAuto, currentPage, useWindow, inline } = this.props
    
    if(isSearchLoading) return <Skeleton avatar paragraph={{ rows: 4 }} />
    
    const NotiList = (
      <InfiniteScroll
        /* NOTE : không load chỗ này sẽ dẫn đến vòng lập vô hạn */
        initialLoad={false}
        pageStart={currentPage}
        hasMore={loading}
        threshold={200}
        loader={<LoadMoreIcon key={0} />}
        loadMore={page =>
          this.props.loadNotificationsByType(
            page,
            stationAuto,
            this.state.txtSearch
          )
        }
        useWindow={useWindow}
      >
        <Cells
          inline={inline}
          dataSource={dataSource}
          closeDrawer={this.props.closeDrawer}
        />
      </InfiniteScroll>
    )
    return (
      <div>
        {
          useWindow 
          ? NotiList 
          : <div style={{ height: '90vh', overflow: 'auto' }}>
              {NotiList}
              <div style={{ height: 100 }} />
            </div>
        }
      </div>
    )
  }
}
