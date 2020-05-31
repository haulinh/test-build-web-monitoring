import React from 'react'
import { autobind } from 'core-decorators'
import styled from 'styled-components'
import NotificationIcon from '@atlaskit/icon/glyph/notification'
import { connectAutoDispatch } from 'redux/connect'
import {
  getTotalByNotificationType,
  setDrawerVisible,
  resetAllCounts,
  clearTotalNotificationCount,
} from 'redux/actions/notification'
import {
  getListOfStationAuto,
  getTotalActived,
} from 'redux/actions/stationAuto'
import NotificationDrawer from 'layout/navigation-layout/NotificationDrawer'
import { SHAPE } from 'themes/color'

const NotificationWrapperIcon = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  .badge {
    position: absolute;
    top: -4px;
    right: -8px;
    background-color: ${SHAPE.RED};
    font-size: 10px;
    border-radius: 8px;
    padding: 4px;
  }
`

@connectAutoDispatch(
  state => ({
    notificationCount: state.notification.count,
    tokenFCM: state.auth.tokenFCM,
    drawerVisible: state.notification.visible,
  }),
  {
    getListOfStationAuto,
    getTotalActived,
    getTotalByNotificationType,
    setDrawerVisible,
    resetAllCounts,
    clearTotalNotificationCount,
  }
)
@autobind
export default class Notification extends React.PureComponent {
  componentDidMount() {
    this.props.getTotalByNotificationType()
    this.props.getListOfStationAuto()
    this.props.getTotalActived()
  }

  handleClickNotification() {
    this.props.setDrawerVisible(true)
    this.props.resetAllCounts()
    this.props.clearTotalNotificationCount()
  }

  render() {
    return (
      <div>
        <NotificationWrapperIcon onClick={this.handleClickNotification}>
          <NotificationIcon color="#fff" size="large" />
          {this.props.notificationCount ? (
            <div className="badge">{this.props.notificationCount}</div>
          ) : null}
        </NotificationWrapperIcon>
        <NotificationDrawer
          closeDrawer={() => this.props.setDrawerVisible(false)}
          visible={this.props.drawerVisible}
        />
      </div>
    )
  }
}
