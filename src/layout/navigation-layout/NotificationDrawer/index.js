import NotificationIcon from '@atlaskit/icon/glyph/notification'
import { Drawer, Switch } from 'antd'
import { translate } from 'hoc/create-lang'
import _ from 'lodash'
import propTypes from 'prop-types'
import React from 'react'
import {
  clearNotificationCountByType,
  deleteAllNotification,
  updateAllRead,
  toggleNoti,
} from 'redux/actions/notification'
import { connectAutoDispatch } from 'redux/connect'
import styled from 'styled-components'
import NotificationContent from './notificationContent'
import { deleteToken, linkToken2Email } from 'api/NotificationApi'
import { setFcmToken } from 'redux/actions/authAction'


const SideBarNotificationWrapper = styled(Drawer)`
  .ant-drawer-header {
    padding: 16px;
  }
  .ant-drawer-wrapper-body {
    overflow: hidden;
  }
  .tools {
    display: flex;
    /* flex-direction: column-reverse;
    align-items: flex-end */
  }
`
// const DeleteMarkWrapper = styled.div`
//   margin-right: 8px;
// `

// const TitleWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   .titleIconWrapper {
//     display: flex;
//     align-items: center;
//     h4 {
//       margin-bottom: 0px;
//       font-size: 22px;
//       margin-left: 8px;
//     }
//   }
//   .close {
//     color: #333 !important;
//   }
// `

const NotificationWrapperIcon = styled.div`
  color: #333
  background-color: #e4e6eb;
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    width: 24px;
    height: 24px;
  }
`

const DivBenTrai = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const DivBenPhai = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const i18n = {
  label: translate('notification.label'),
  removeAll: translate('notification.removeAll'),
  markAll: translate('notification.markAll'),
}


@connectAutoDispatch(
  state => ({
    dataSource: state.notification.logs,
    tokenFCM: state.auth.tokenFCM,
    authInfo: state.auth.userInfo,
  }),
  {
    clearNotificationCountByType,
    updateAllRead,
    deleteAllNotification,
    toggleNoti,
    setFcmToken
  }
)
export default class NotificationDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMarkedReadAll: false,
    }
  }
  static propTypes = {
    /* Component's props */
    closeDrawer: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired,
    /* Redux's props */
    clearNotificationCountByType: propTypes.func.isRequired,
    updateAllRead: propTypes.func.isRequired,
    dataSource: propTypes.array.isRequired,
  }

  static defaultProps = {}

  // turnOnNoti = () => {
  //   console.log('===turnOnNoti')
  // }
  // turnOffNoti = () => {
  //   console.log('===turnOffNoti')
  // }


  onChange = checked => {
    if (checked) {
      const me = this

      const { messaging } = require('utils/init-fcm')
      // NOTE  request permission Noti và đăng ký sự kiện 'message' với serviceWorker
      console.log('===start req premission .....')
      messaging
        .requestPermission()
        .then(async function () {
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
        .catch(function (err) {
          console.log('Unable to get permission to notify.', err)
        })

      navigator.serviceWorker.addEventListener('message', message => {
        // NOTE  NOTIFICATION_MESSAGE khi có noti thì sẽ chạy đoạn code trong đây
      })
      localStorage.setItem('isEnablePushNoti', true)
    } else {
      deleteToken(this.props.tokenFCM, this.props.authInfo.email)
      localStorage.setItem('isEnablePushNoti', false)
    }
  }
  getDefaultStatus() {
    const result = localStorage.getItem('isEnablePushNoti')
    if (result === null) return true
    return JSON.parse(result)
  }



  render() {
    return (
      <SideBarNotificationWrapper
        width="35vw"
        bodyStyle={{
          height: 'calc(100vh - 55px)',
          padding: 0,
        }}
        title={
          <div>
            <Flex>
              <DivBenTrai>
                <NotificationWrapperIcon onClick={this.handleClickNotification}>
                  <NotificationIcon color="#fff" size="large" />
                </NotificationWrapperIcon>
                <h4 style={{ margin: '0px', marginLeft: '8px' }}>
                  {i18n.label}
                </h4>
              </DivBenTrai>
              <Switch
                defaultChecked={this.getDefaultStatus()}
                onChange={this.onChange} />
            </Flex>

            <DivBenPhai>
              <div>

                {this.props.dataSource && this.props.dataSource.length > 0 &&
                  this._areAllNotificationsRead() && (
                    <a
                      onClick={this._handleDeleteAllNotification}
                      style={{
                        color: '#385898',
                      }}
                    >
                      {i18n.removeAll}
                    </a>
                  )}
                {this.props.dataSource && this.props.dataSource.length > 0 &&
                  !this._areAllNotificationsRead() && (
                    <a
                      onClick={this.checkReadAll}
                      style={{
                        color: '#385898',
                      }}
                    >
                      {i18n.markAll}
                    </a>
                  )}
              </div>
              {/* <a
                style={{ marginLeft: '8px' }}
                href="_blank"
                onClick={this.closeDrawer}
              >
                <CrossIcon />
              </a> */}
            </DivBenPhai>
          </div>
        }
        placement="left"
        closable={false}
        onClose={this.closeDrawer}
        visible={this.props.visible}
      >
        <NotificationContent
          isEmptyNotification={this._areAllNotificationsRead()}
          closeDrawer={this.closeDrawer}
        />
      </SideBarNotificationWrapper>
    )
  }

  closeDrawer = e => {
    if (e) e.preventDefault()
    this.props.clearNotificationCountByType()
    this.props.closeDrawer()
  }
  checkReadAll = e => {
    this.props.updateAllRead()
  }
  _areAllNotificationsRead = () => {
    const { dataSource } = this.props
    const haveSomeUnreadNotification = _.some(dataSource, ['isRead', false])
    return !haveSomeUnreadNotification
  }
  _handleDeleteAllNotification = () => {
    this.props.deleteAllNotification()
  }
  _toggleNoti = (isEnable) => {
    this.props.toggleNoti(isEnable)
  }
}
