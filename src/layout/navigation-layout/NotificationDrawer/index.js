import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import {Drawer, Icon, Tabs, Badge} from 'antd'

import { translate } from 'hoc/create-lang'
import { TAB_KEYS } from 'constants/notification'
import { connectAutoDispatch } from 'redux/connect'
import { setIsLoading, loadNotificationsByType, clearNotificationCountByType} from 'redux/actions/notification'
import ExceededTabContent from './tabs/exceeded'
import LostDataTabContent from './tabs/lostData'
import SensorErrorTabContent from './tabs/sensorError'

const TabPane = Tabs.TabPane

const i18n = {
  exceeded   : translate('warningLevels.exceed'),
  lostSignal : translate('warningLevels.lostData'),
  sensorError: translate('warningLevels.sensorError'),
}

function BadgeWrapper(props) {
  return (
    <Badge 
      style={{transform: 'scale(0.8)', right: -31, top: -11}} 
      overflowCount={Infinity} 
      {...props}>
      {props.children}
    </Badge>
  )
}

const DrawerWrapper = styled(Drawer)`
  .ant-drawer-wrapper-body {
    overflow: hidden !important;
    height: 100%;
  }
`

const TabsWrapper = styled(Tabs)`
  .ant-tabs-content{
    height: 85vh
    position: relative;
  }
    .ant-tabs-tabpane{
      overflow: auto;
      height: 100%;
    }   
`

@connectAutoDispatch(
  (state) => ({
    notificationCount: state.notification.count,
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
    notificationCount: propTypes.number.isRequired,
    loadNotificationsByType: propTypes.func.isRequired,
    clearNotificationCountByType: propTypes.func.isRequired,
    setIsLoading: propTypes.func.isRequired,
  }

  static defaultProps = {
    notificationNumbers: {
      exceeded: 2,
      lostData: 40,
      deviceError: 100697607807
    }
  }

  state = {
    currentTabKey: TAB_KEYS.EXCEEDED,
  }

  componentDidMount() {
  }

  render() {
    const { currentTabKey } = this.state
    const { notificationCount } = this.props
    return (
        <DrawerWrapper
        width='40vw'
        bodyStyle={{height: '100%', padding: 8}}
        title={<div onClick={this.closeDrawer}><Icon type="double-left" /> Notifications</div>}
        placement="left"
        closable={false}
        onClose={this.closeDrawer}
        visible={this.props.visible}
      >
        <TabsWrapper
          style={{height: '100%'}}
          activeKey={currentTabKey}
          onChange={this.handleChangeTab}>
        
          {/* NOTE  TAB EXCEEDED */}
          <TabPane
            key={TAB_KEYS.EXCEEDED}
            tab={<BadgeWrapper count={notificationCount.exceeded}>{i18n.exceeded}</BadgeWrapper>}>
            <ExceededTabContent loadNotifications={this.loadNotifications} closeDrawer={this.closeDrawer}/>
          </TabPane>

          {/* NOTE  TAB LOST_SIGNAL */}
          <TabPane 
            key={TAB_KEYS.LOST_SIGNAL}
            tab={<BadgeWrapper count={notificationCount.lostSignal}>{i18n.lostSignal}</BadgeWrapper>}>
            <LostDataTabContent loadNotifications={this.loadNotifications} closeDrawer={this.closeDrawer}/>
          </TabPane>

          {/* NOTE  TAB SENSOR_ERROR */}
          <TabPane 
            key={TAB_KEYS.SENSOR_ERROR}
            tab={<BadgeWrapper count={notificationCount.sensorError}>{i18n.sensorError}</BadgeWrapper>}>
            <SensorErrorTabContent loadNotifications={this.loadNotifications} closeDrawer={this.closeDrawer}/>
          </TabPane>

        </TabsWrapper>
      </DrawerWrapper>
      )
  }

  closeDrawer = () => {
    this.props.clearNotificationCountByType( this.state.currentTabKey )
    this.props.closeDrawer()
  }

  handleChangeTab = (newTabKey) => {
    this.props.clearNotificationCountByType( this.state.currentTabKey )
    this.setState({currentTabKey: newTabKey})
  }

  loadNotifications = (page) => {
    const { currentTabKey } = this.state
    const { stationAuto } = this.props
    this.props.loadNotificationsByType(page, currentTabKey, stationAuto)
  }

}


