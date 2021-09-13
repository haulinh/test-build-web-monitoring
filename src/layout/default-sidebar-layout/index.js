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
import { deepParseJson } from 'utils/string'
import { NOTIFY_TYPE } from 'constants/notification'
import { translate as t } from 'hoc/create-lang'

// import { deepParseJson } from 'deep-parse-json'

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
const i18n = {
  station: t('common.station'),
  measurings: t('common.measures'),
  dataConnected: t('common.deviceStatus.dataConnected'),
  dataExeeded: t('common.deviceStatus.dataExceeded'),
  dataExceededPrepare: t('common.deviceStatus.dataExceededPrepare'),
  dataGood: t('common.deviceStatus.dataGood2'),
  dataLoss: t('common.deviceStatus.dataLoss'),
  sensorAdjust: t('common.deviceStatus.sensorMaintain'),
  sensorError: t('common.deviceStatus.sensorError'),
  sensorGood: t('common.deviceStatus.sensorGood'),
}
const getNotificationInfo = status => {
  switch (status) {
    case NOTIFY_TYPE.SENSOR_GOOD:
      return {
        statusText: i18n.sensorGood,
      }
    case NOTIFY_TYPE.SENSOR_ERROR:
      return {
        statusText: i18n.sensorError,
      }
    case NOTIFY_TYPE.DATA_CONNECTED:
      return {
        statusText: i18n.dataConnected,
      }
    case NOTIFY_TYPE.DATA_EXCEEDED:
      return {
        statusText: i18n.dataExeeded,
      }
    case NOTIFY_TYPE.DATA_EXCEEDED_PREPARED:
      return {
        statusText: i18n.dataExceededPrepare,
      }
    case NOTIFY_TYPE.SENSOR_ADJUST:
      return {
        statusText: i18n.sensorAdjust,
      }
    case NOTIFY_TYPE.DATA_GOOD:
      return {
        statusText: i18n.dataGood,
      }
    case NOTIFY_TYPE.DATA_LOSS:
      return {
        statusText: i18n.dataLoss,
      }
    default:
      return {
        statusText: '',
      }
  }
}
@createProtectedAuth
@connectAutoDispatch(
  state => ({
    state,
    navigationIsOpen: state.theme.navigation.isOpen,
    stationAuto: state.stationAuto.list,
  }),
  {
    toggleNavigation,
    updateNotificationOnMessage,
    setFcmToken,
  }
)
@withRouter
@autobind
export default class DefaultSidebarLayoutContainer extends Component {
  static propTypes = {
    isShowSidebarMenu: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      navigationWidth: 320,
    }
  }

  componentDidMount() {
    // import { messaging } from "utils/init-fcm";
    // MARK  vì phải chờ app.json nen phải load o day
    const _isEnablePushNoti = () => {
      const result = localStorage.getItem('isEnablePushNoti')
      if (result === null) return true
      return JSON.parse(result)
    }

    if (_isEnablePushNoti()) {
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

              // save fcm-token to backend DB
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
          console.log(payload, '======payload from firebase')
          /* note: format data de tuong thich code */
          payload.data.measures = payload.data.measures
            ? deepParseJson(payload.data.measures)
            : []
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
  }

  _showNotification(payload) {
    const { statusText } = getNotificationInfo(payload.data.status)

    // console.log(statusText, '==statusText==')
    notification['info']({
      message: payload.data.title,
      description: statusText,
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
    this.props.toggleNavigation(!this.props.navigationIsOpen)
  }

  getAllSidebarWidth() {
    if (!this.props.isShowSidebarMenu) return SIDEBAR_GLOBAL_WIDTH
    return this.props.navigationIsOpen
      ? SIDEBAR_GLOBAL_WIDTH + SIDEBAR_MENU_WIDTH
      : SIDEBAR_GLOBAL_WIDTH + SIDEBAR_MENU_MINIMAL_WIDTH
  }

  render() {
    // const payload = {
    //   notification: {
    //     title: "cuongtest",
    //     body: "test"
    //   },
    //   data: {
    //     title: "cuongtest",

    //     status: "SENSOR_GOOD"
    //   }
    // }
    return (
      <Wrapper allSidebarWidth={this.getAllSidebarWidth()}>
        {/* <button onClick={() => this._showNotification(payload)}>click me</button> */}
        <SidebarGlobal />
        {this.props.isShowSidebarMenu && (
          <SidebarMenu
            onToggle={this.handleToggleSidebar}
            isShow={this.props.navigationIsOpen}
          />
        )}
        {this.props.children}
      </Wrapper>
    )
  }
}
