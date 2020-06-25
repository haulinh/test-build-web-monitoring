import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import { Drawer } from 'antd'
import { connectAutoDispatch } from 'redux/connect'
import { clearNotificationCountByType } from 'redux/actions/notification'
import NotificationContent from './notificationContent'
import NotificationIcon from '@atlaskit/icon/glyph/notification'
import CrossIcon from '@atlaskit/icon/glyph/cross'

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

@connectAutoDispatch(state => ({}), { clearNotificationCountByType })
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* Component's props */
    closeDrawer: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired,
    /* Redux's props */
    clearNotificationCountByType: propTypes.func.isRequired,
  }

  static defaultProps = {}

  render() {
    return (
      <Drawer
        width="30vw"
        bodyStyle={{
          height: 'calc(100vh - 55px)',
          padding: 0,
          paddingLeft: 16,
        }}
        title={
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
        }
        placement="left"
        closable={false}
        onClose={this.closeDrawer}
        visible={this.props.visible}
      >
        <NotificationContent closeDrawer={this.closeDrawer} />
      </Drawer>
    )
  }

  closeDrawer = e => {
    if (e) e.preventDefault()
    this.props.clearNotificationCountByType()
    this.props.closeDrawer()
  }
}
