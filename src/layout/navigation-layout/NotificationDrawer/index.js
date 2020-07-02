import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import { Drawer } from 'antd'
import { connectAutoDispatch } from 'redux/connect'
import {
  clearNotificationCountByType,
  updateAllRead,
  deleteAllNotification,
} from 'redux/actions/notification'
import NotificationContent from './notificationContent'
import NotificationIcon from '@atlaskit/icon/glyph/notification'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import _ from 'lodash'

const DeleteMarkWrapper = styled.div`
position: absolute;
right:16px;
bottom:0px;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleIconWrapper {
    display: flex;
    align-items: center;
    h4 {
      margin-bottom: 0px;
      font-size: 22px;
      margin-left: 8px;
    }
  }
  .close {
    color: #333 !important;
  }
`

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

@connectAutoDispatch(state => ({
  dataSource: state.notification.logs,
}), {
  clearNotificationCountByType,
  updateAllRead,
  deleteAllNotification
})
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

  render() {
    return (
      <Drawer
        width="30vw"
        bodyStyle={{
          height: 'calc(100vh - 55px)',
          padding: 0,
        }}
        title={
          <div>
            <TitleWrapper>
              <div className="titleIconWrapper">
                <NotificationWrapperIcon onClick={this.handleClickNotification}>
                  <NotificationIcon color="#fff" size="large" />
                </NotificationWrapperIcon>
                <h4>Notifications</h4>
              </div>

              <a className="close" href="_blank" onClick={this.closeDrawer}>
                <CrossIcon />
              </a>
            </TitleWrapper>
            <DeleteMarkWrapper>
              <div>
                {
                  this.props.dataSource.length > 0 && this._areAllNotificationsRead() &&
                  (
                    <a
                      onClick={this._handleDeleteAllNotification}
                      style={{
                        color: '#385898',
                      }}
                    >
                      Xoá tất cả
                    </a>
                  )

                }
                {
                  this.props.dataSource.length > 0 && !this._areAllNotificationsRead() &&
                  (
                    <a
                      onClick={this.checkReadAll}
                      style={{
                        color: '#385898',
                      }}
                    >
                      Đánh dấu tất cả đã đọc
                    </a>
                  )
                }
              </div>
            </DeleteMarkWrapper>

          </div>
        }
        placement="left"
        closable={false}
        onClose={this.closeDrawer}
        visible={this.props.visible}
      >
        <NotificationContent isEmptyNotification={this._areAllNotificationsRead()} closeDrawer={this.closeDrawer} />
      </Drawer>
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
}
