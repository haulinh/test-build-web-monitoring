import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createProtectedAuth from 'hoc/protected-auth'
import styled from 'styled-components'
import { connectAutoDispatch } from 'redux/connect'
import { withRouter } from 'react-router-dom'
import { toggleNavigation } from 'redux/actions/themeAction'
import { updateNotificationOnMessage } from 'redux/actions/notification'
import { autobind } from 'core-decorators'
import { linkToken2Email } from 'api/NotificationApi'
import { notification } from 'antd'
// import { TAB_KEYS } from 'constants/notification'
// import slug from 'constants/slug'
// import _ from 'lodash'
import { setFcmToken } from 'redux/actions/authAction'
import SidebarGlobal, { SIDEBAR_GLOBAL_WIDTH } from './sidebar-global'
import SidebarMenu, {
  SIDEBAR_MENU_WIDTH,
  SIDEBAR_MENU_MINIMAL_WIDTH,
} from './sidebar-menu'

const Wrapper = styled.div`
  padding-left: ${props => props.allSidebarWidth}px;
  transition: all 0.3s linear;
`

@createProtectedAuth
@connectAutoDispatch(
  state => ({
    state,
    navigationIsOpen: state.theme.navigation.isOpen,
    stationAuto: state.stationAuto.list,
  }),
  { toggleNavigation, updateNotificationOnMessage, setFcmToken }
)
@withRouter
@autobind
export default class DefaultSidebarLayoutContainer extends Component {
  static propTypes = {
    isShowSidebarMenu: PropTypes.bool,
  }

  componentDidMount() {
    // import { messaging } from "utils/init-fcm";
    // MARK  vì phải chờ app.json nen phải load o day
    const me = this
    try {
      const { messaging } = require('utils/init-fcm')
      // NOTE  request permission Noti và đăng ký sự kiện 'message' với serviceWorker
      messaging
        .requestPermission()
        .then(async function() {
          const token = await messaging.getToken()
          // NOTE  sau khi get đuợc token, sẽ cần báo cho back-end bik, token này link với email:user nào
          try {
            // let response =
            await linkToken2Email(token)
            me.props.setFcmToken(token)
          } catch (e) {
            console.log('error linkToken2Email', e)
          }
        })
        .catch(function(err) {
          console.log('Unable to get permission to notify.', err)
        })

      navigator.serviceWorker.addEventListener('message', message => {
        // NOTE  NOTIFICATION_MESSAGE khi có noti thì sẽ chạy đoạn code trong đây
      })

      messaging.onMessage(payload => {
        /* note: format data de tuong thich code */
        payload.data.isRead = false
        this._showNotification(payload)
        this.props.updateNotificationOnMessage(
          payload.data,
          this.props.stationAuto
        )
      })
    } catch (e) {
      console.error('Notification only start witl https')
    }
  }

  state = {
    navigationWidth: 320,
    isSidebarMenuShow: true,
  }

  _showNotification(payload) {
    notification['info']({
      message: payload.notification.title,
      description: payload.notification.body,
    })
  }

  getNavigation() {
    // const { pathname } = this.props.location
    //&& pathname !== slug.monitoringList.base,
    return {
      width: this.state.navigationWidth,
      isOpen: this.props.navigationIsOpen,
    }
  }

  handleResizeNavigation({ isOpen, width }) {
    this.props.toggleNavigation(isOpen)
    this.setState({
      navigationWidth: width,
    })
  }

  handleToggleSidebar() {
    this.setState({ isSidebarMenuShow: !this.state.isSidebarMenuShow })
  }

  getAllSidebarWidth() {
    if (!this.props.isShowSidebarMenu) return SIDEBAR_GLOBAL_WIDTH
    return this.state.isSidebarMenuShow
      ? SIDEBAR_GLOBAL_WIDTH + SIDEBAR_MENU_WIDTH
      : SIDEBAR_GLOBAL_WIDTH + SIDEBAR_MENU_MINIMAL_WIDTH
  }

  render() {
    return (
      <Wrapper allSidebarWidth={this.getAllSidebarWidth()}>
        <SidebarGlobal />
        {this.props.isShowSidebarMenu && (
          <SidebarMenu
            onToggle={this.handleToggleSidebar}
            isShow={this.state.isSidebarMenuShow}
          />
        )}
        {this.props.children}
      </Wrapper>
    )
  }
}
