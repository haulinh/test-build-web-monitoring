import React, { Fragment } from 'react'
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
import { Tooltip } from 'antd'
import { translate } from 'hoc/create-lang'
import { withRouter } from 'react-router-dom'

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
  &:hover {
    cursor: pointer;
  }
  > span {
    width: 24px;
    height: 24px;
  }
  .badge {
    position: absolute;
    top: -4px;
    left: -8px;
    background-color: ${SHAPE.RED};
    font-size: 10px;
    border-radius: 8px;
    padding: 4px;
  }
`

@withRouter
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

  handleClickNotification(e) {
    //Function prevent auto scroll monitoring when click notification
    if (this.props.history.location.pathname === '/monitoring') {
      this.props.history.replace(this.props.history.location.pathname)
    }

    e.preventDefault()
    this.props.setDrawerVisible(true)
    this.props.resetAllCounts()
    this.props.clearTotalNotificationCount()
  }

  render() {
    return (
      <Fragment>
        <NotificationDrawer
          closeDrawer={() => this.props.setDrawerVisible(false)}
          visible={this.props.drawerVisible}
        />
        <Tooltip
          placement={'bottom'}
          title={translate(`tooltipMenuApp.notification`)}
        >
          <NotificationWrapperIcon onClick={this.handleClickNotification}>
            <NotificationIcon color="#fff" size="large" />
            {this.props.notificationCount ? (
              <div className="badge">
                {this.props.notificationCount < 99
                  ? this.props.notificationCount
                  : '99+'}
              </div>
            ) : null}
          </NotificationWrapperIcon>
        </Tooltip>
      </Fragment>
    )
  }
}
