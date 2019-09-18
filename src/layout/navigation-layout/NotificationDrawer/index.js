import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import {Drawer, Icon} from 'antd'

import { connectAutoDispatch } from 'redux/connect'
import { clearNotificationCountByType} from 'redux/actions/notification'
import NotificationContent from './notificationContent'

@connectAutoDispatch(
  (state) => ({
  }),
  { clearNotificationCountByType }
)
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
        width='30vw'
        bodyStyle={{height: "calc(100vh - 55px)", padding: 0, paddingLeft: 16}}
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


