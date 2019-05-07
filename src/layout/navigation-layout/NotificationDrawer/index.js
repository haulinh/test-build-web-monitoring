import React from 'react'
import propTypes from 'prop-types'
import {Drawer, Icon, Tabs, Badge} from 'antd'

import { translate } from 'hoc/create-lang'
import { TAB_KEYS } from 'constants/notification'
import { connectAutoDispatch } from 'redux/connect'
import {loadNotificationsByType} from 'redux/actions/notification'
import ExceededTabContent from './tabs/exceeded'
import LostDataTabContent from './tabs/lostData'
import SensorErrorTabContent from './tabs/sensorError'



const TabPane = Tabs.TabPane

const i18n = {
  exceeded: translate('warningLevels.exceed'),
  lostData: translate('warningLevels.lostData'),
  sensorError: translate('warningLevels.sensorError'),
}

@connectAutoDispatch(
  (state) => {},
  { loadNotificationsByType }
)
export default class NotificationDrawer extends React.Component {
  static propTypes = {
    closeDrawer: propTypes.func.isRequired,
    visible: propTypes.bool.isRequired,
    notificationNumbers: propTypes.object.isRequired,
    dataSources: propTypes.object.isRequired,
    // notificationNumbers: propTypes.object.isRequired
  }

  static defaultProps = {
    notificationNumbers: {
      exceeded: 0,
      lostData: 0,
      deviceError: 0
    }
  }

  state = {
    currentTabKey: TAB_KEYS.EXCEEDED,
    notifications: {
      exceeded: [],
      lostData: [],
      deviceError: [],
    }
  }

  render() {
    const {currentTabKey, notifications} = this.state
    const { 
      notificationNumbers, closeDrawer,
      dataSources,
     } = this.props
    return (
      <Drawer
        width='40vw'
        title={<div onClick={closeDrawer}>
          <Icon type="double-left" /> Notifications
        </div>}
        placement="left"
        closable={false}
        onClose={closeDrawer}
        visible={this.props.visible}
      >
        <Tabs
          activeKey={currentTabKey}
          onChange={this.handleChangeTab}>
          
          {/* NOTE  TAB EXCEEDED */}
          <TabPane
            key={TAB_KEYS.EXCEEDED}
            tab={<Badge count={notificationNumbers.exceeded}>{i18n.exceeded}</Badge>}>
            <ExceededTabContent loadNotifications={this.loadNotifications} />
          </TabPane>

          {/* NOTE  TAB LOST_DATA */}
          <TabPane 
            key={TAB_KEYS.LOST_DATA}
            tab={<Badge count={notificationNumbers.lostData}>{i18n.lostData}</Badge>}>
            <LostDataTabContent loadNotifications={this.loadNotifications} />
          </TabPane>

          {/* NOTE  TAB DEVICE_ERROR */}
          <TabPane 
            key={TAB_KEYS.DEVICE_ERROR}
            tab={<Badge count={notificationNumbers.deviceError}>{i18n.sensorError}</Badge>}>
            <SensorErrorTabContent loadNotifications={this.loadNotifications} />
          </TabPane>

        </Tabs>
      </Drawer>
    )
  }

  handleChangeTab = (tabKey) => {
    this.setState({currentTabKey: tabKey})
    this.clearNotificationNumberByTabKey(tabKey)
  }

  clearNotificationNumberByTabKey = (tabKey) => {
    /* TODO   */
  }

  loadNotifications = (page) => {
    const { currentTabKey } = this.state
    this.props.loadNotificationsByType()
    console.log('loadNotifications: ',page, currentTabKey)
    /* TODO  getNotification(tabKey, page)*/
  }

}


