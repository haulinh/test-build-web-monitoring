import React from 'react'
import { connectAutoDispatch } from 'redux/connect'
import { logout } from 'redux/actions/authAction'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import { getApps } from 'config'
import UserDropdown from './UserDropdown'
import AppItem from './AppItem'
import NotificationIcon from './NotificationIcon'
import { SidebarGlobal, SIDEBAR_GLOBAL_WIDTH } from './style'
import ChangeLanguage from 'layout/navigation-layout/ChangeLanguage'
import AppList from 'components/app-list/app-list'
import icon from 'assets/svg-icons/icon-ilotusland.svg'
import { fetchApps } from 'api/AdminApi'

export { SIDEBAR_GLOBAL_WIDTH }

const i18n = {
  apps: {
    ilotusland: translate('apps.ilotusland'),
    databaseManagement: translate('apps.databaseManagement'),
  },
}
class SidebarGlobalLayout extends React.PureComponent {
  state = { domains: {} }

  async componentDidMount() {
    const results = await fetchApps()
    this.setState({ domains: results.domains })
  }

  render() {
    const { domains } = this.state
    const appList = [
      {
        text: i18n.apps.ilotusland,
        href: domains.ilotusland,
        icon: <img src={icon} alt="" />,
      },
      {
        text: i18n.apps.databaseManagement,
        href: domains.qlnt,
        icon: <img src={icon} alt="" />,
      },
    ]

    return (
      <SidebarGlobal.Wrapper>
        <SidebarGlobal.SidebarTop>
          <a className="logo" href="/">
            <img alt="iLotusLand" src="/images/logo/logo-icon.png" />
          </a>
          <SidebarGlobal.Line />
          <AppList list={appList} />
          <SidebarGlobal.Line />
          {!getApps().isShow ? <NotificationIcon /> : null}
          {getApps().isShow ? (
            <React.Fragment>
              <AppItem
                name={translate('apps.monitoring')}
                color="#2C5DE5"
                icon="appMonitoring"
                href="/"
              />
              {getApps().incidents ? (
                <AppItem
                  name={translate('apps.incidents')}
                  color="rgb(46, 213, 115)"
                  icon="appIncident"
                  href={slug.apps.incidents}
                />
              ) : null}
              {getApps().grafana ? (
                <AppItem
                  name={translate('apps.grafana')}
                  color="#e67e22"
                  icon="appGrafana"
                  href={slug.apps.grafana}
                />
              ) : null}
            </React.Fragment>
          ) : null}
        </SidebarGlobal.SidebarTop>
        <SidebarGlobal.SidebarBottom>
          <UserDropdown />
          <ChangeLanguage />
        </SidebarGlobal.SidebarBottom>
      </SidebarGlobal.Wrapper>
    )
  }
}

export default connectAutoDispatch(
  state => ({
    authInfo: state.auth.userInfo,
    notificationCount: state.notification.count,
    drawerVisible: state.notification.visible,
    tokenFCM: state.auth.tokenFCM,
  }),
  { logout }
)(SidebarGlobalLayout)
