import React from 'react'
import { connectAutoDispatch } from 'redux/connect'
import ChangeLanguage from 'layout/navigation-layout/ChangeLanguage'
import { logout } from 'redux/actions/authAction'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import NotificationIcon from './NotificationIcon'
import UserDropdown from './UserDropdown'
import AppItem from './AppItem'
import { SidebarGlobal, SIDEBAR_GLOBAL_WIDTH } from './style'

export { SIDEBAR_GLOBAL_WIDTH }

@connectAutoDispatch(
  state => ({
    authInfo: state.auth.userInfo,
    notificationCount: state.notification.count,
    drawerVisible: state.notification.visible,
    tokenFCM: state.auth.tokenFCM,
  }),
  {
    logout,
    // getListOfStationAuto,
    // getTotalActived,
    // getTotalByNotificationType,
    // setDrawerVisible,
    // resetAllCounts,
    // clearTotalNotificationCount
  }
)
export default class SidebarGlobalLayout extends React.PureComponent {
  render() {
    return (
      <SidebarGlobal.Wrapper>
        <SidebarGlobal.SidebarTop>
          <a className="logo" href="/">
            <img alt="iLotusLand" src="/images/logo/logo-icon.png" />
          </a>
          <SidebarGlobal.Line />
          <AppItem
            name={translate('apps.monitoring')}
            color="#2C5DE5"
            icon="appMonitoring"
            href="/"
          />
          <AppItem
            name={translate('apps.incidents')}
            color="rgb(46, 213, 115)"
            icon="appIncident"
            href={slug.apps.incidents}
          />
        </SidebarGlobal.SidebarTop>
        <SidebarGlobal.SidebarBottom>
          <NotificationIcon />
          <UserDropdown />
          <ChangeLanguage />
        </SidebarGlobal.SidebarBottom>
      </SidebarGlobal.Wrapper>
    )
  }
}
