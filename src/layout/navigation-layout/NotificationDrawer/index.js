import React from 'react'
import propTypes from 'prop-types'
import { Drawer, Icon } from 'antd'

import { connectAutoDispatch } from 'redux/connect'
import {
  clearNotificationCountByType,
  updateNotifyAllRead,
} from 'redux/actions/notification'
import NotificationContent from './notificationContent'
import styled from 'styled-components'
const Checked = styled.div`
  display: flex;
  justify-content: space-between;
`
@connectAutoDispatch(state => ({}), {
  clearNotificationCountByType,
  updateNotifyAllRead,
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
    updateNotifyAllRead: propTypes.func.isRequired,
  }

  static defaultProps = {}

  render() {
    return (
      <Drawer
        width="30vw"
        bodyStyle={{
          //height: 'calc(100vh - 55px)',
          padding: 0,
        }}
        title={
          <Checked>
            <div>
              <a
                href="#"
                onClick={this.closeDrawer}
                style={{ paddingRight: '8px' }}
              >
                <Icon type="left" />
              </a>
              Notifications
            </div>

            <div>
              <a
                onClick={this.checkReadAll}
                style={{
                  color: '#385898',
                  fontSize: '12px',
                }}
              >
                Đánh dấu tất cả
              </a>
            </div>
          </Checked>
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
  checkReadAll = e => {
    this.props.updateNotifyAllRead()
    console.log('ismark')
  }
}
