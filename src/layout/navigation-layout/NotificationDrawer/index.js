import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import {Drawer, Icon} from 'antd'

import { connectAutoDispatch } from 'redux/connect'
import { setIsLoading, loadNotificationsByType, clearNotificationCountByType} from 'redux/actions/notification'
import NotificationContent from './notificationContent'

@connectAutoDispatch(
  (state) => ({
    stationAuto: state.stationAuto.list
  }),
  { setIsLoading, loadNotificationsByType, clearNotificationCountByType }
)
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    /* Component's props */
    closeDrawer: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired,
    notificationNumbers: propTypes.object.isRequired,
    /* Redux's props */
    stationAuto: propTypes.array.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
    clearNotificationCountByType: propTypes.func.isRequired,
    setIsLoading: propTypes.func.isRequired,
  }

  static defaultProps = {
    stationAuto: [],
  }

  render() {
    return (
      <Drawer
        width='40vw'
        bodyStyle={{height: '100%', padding: 8}}
        title={<div onClick={this.closeDrawer}><Icon type="double-left" /> Notifications</div>}
        placement="left"
        closable={false}
        onClose={this.closeDrawer}
        visible={this.props.visible}
      >
        <NotificationContent closeDrawer={this.closeDrawer} />
      </Drawer>
      )
  }

  closeDrawer = () => {
    this.props.clearNotificationCountByType()
    this.props.closeDrawer()
  }
}


