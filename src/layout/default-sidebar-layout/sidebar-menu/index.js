import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'
// import { AkContainerNavigationNested } from '@atlaskit/navigation'
import { connect } from 'react-redux'
import { Menu, Tooltip } from 'antd'
import { remove as _remove, join as _join } from 'lodash'
import { Link } from 'react-router-dom'
import Icon from 'themes/icon'
import slug, {
  parentMenuFromSub,
  MENU_NAME,
  TOOLTIP_MENU,
} from 'constants/slug'
// import { translate } from 'hoc/create-lang'
import { selectMenu, changeOpenSubMenu } from 'redux/actions/themeAction'
// import { adapt } from "chromatism";
import SimpleBarReact from 'simplebar-react'
import protectRole from 'hoc/protect-role/forMenu'
import ROLE from 'constants/role'
import styled from 'styled-components'
import LogoBrandName from './LogoBrandName'
import ToggleResize from './ToggleResize'
import MonitoringMenu from '../MenuMonitoring'
import HandleDataMenu from '../HandleDataMenu'
import ShareDataMenu from '../ShareDataMenu'
import ReportMenu from '../ReportMenu'
import AdvanceMenu from '../AdvanceMenu'
import ConfigMenu from '../ConfigMenu'
import StationFixedMenu from '../StationFixedMenu'

import { SIDEBAR_GLOBAL_WIDTH } from '../sidebar-global/style'
import objectPath from 'object-path'
import { isEqual } from 'lodash'

export const SIDEBAR_MENU_WIDTH = 275
export const SIDEBAR_MENU_MINIMAL_WIDTH = 8

export const LEFT_SIDEBAR_SHOW = SIDEBAR_GLOBAL_WIDTH
export const LEFT_SIDEBAR_HIDE = -(
  SIDEBAR_MENU_WIDTH -
  SIDEBAR_MENU_MINIMAL_WIDTH -
  SIDEBAR_GLOBAL_WIDTH
)

const SidebarWrapper = styled.div`
  left: ${props => (props.isShow ? LEFT_SIDEBAR_SHOW : LEFT_SIDEBAR_HIDE)}px;
  position: fixed;
  top: 0px;
  bottom: 0px;
  transition: all 0.3s linear;
  width: ${SIDEBAR_MENU_WIDTH}px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: rgb(244, 245, 247);
  #logoBrandName {
    display: block;
    padding: 16px 8px;
  }

  .ant-menu-root.ant-menu {
    padding: 8px 8px !important;
    margin-left: 0px;
    overflow: hidden;
    flex: 1;
  }

  .ant-menu.ant-menu-sub {
    padding: 0px 0px !important;
    overflow-x: hidden;
    flex: 1;
  }

  .ant-menu-submenu .ant-menu.ant-menu-sub {
  }
`

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
}

@withRouter
@connect(
  state => ({
    isOpenNavigation: state.theme.navigation.isOpen,
    menuSelected: state.theme.menuSelected,
    openSubMenu: state.theme.openSubMenu,

    authRole: state.auth.userInfo.role,
    isAdmin: state.auth.userInfo.isAdmin,
    organization: state.auth.userInfo.organization,
  }),
  {
    selectMenu,
    changeOpenSubMenu,
  }
)
@autobind
export default class MenuApp extends React.PureComponent {
  static propTypes = {
    onToggle: PropTypes.func,
    isShow: PropTypes.bool,
  }

  state = {
    openSubMenu: ['monitoring'],
  }

  componentDidMount() {
    // set menu selected
    const pathname = this.props.location.pathname
    let menuSelect = pathname

    // set expand menu
    let menuExpande = parentMenuFromSub[pathname]
    if (!menuExpande) {
      let pathObj = this.getPath(pathname)
      menuExpande = parentMenuFromSub[pathObj.menuExpande]
      menuSelect = pathObj.menuSelect
    }

    this.props.selectMenu(menuSelect)
    this.props.changeOpenSubMenu([menuExpande])
  }

  componentWillReceiveProps(nextProps) {
    const pathname = this.props.location.pathname
    let pathObj = this.getPath(pathname)

    const nextPathname = nextProps.location.pathname
    let nextPathObj = this.getPath(nextPathname)

    if (!isEqual(pathObj, nextPathObj)) {
      const menuSelect = nextPathname
      // let menuExpande = parentMenuFromSub[nextPathname] || parentMenuFromSub[nextPathObj.menuExpande]
      this.props.selectMenu(menuSelect)
      // this.props.changeOpenSubMenu([menuExpande])
    }
  }

  getPath(path) {
    let result = ''

    let tampArr = path.split('/')

    // console.log(tampArr, "tampArr")
    const menuExpande = '/' + tampArr[1]
    let isStop = false
    _remove(tampArr, item => {
      if (item.includes('edit') || item.includes('create')) {
        isStop = true
      }
      return isStop
    })

    result = _join(tampArr, '/')
    return {
      menuSelect: result,
      menuExpande: menuExpande,
    }
  }

  checkRoleForGroup(otherKeyRoles) {
    let isShow = false
    otherKeyRoles.forEach(oKeyRole => {
      if (this.checkRole(oKeyRole)) isShow = true
    })
    return isShow
  }

  checkRole(role) {
    // check role in organization first
    let isRole = objectPath.get(this.props.organization, role)
    if (!isRole) return isRole
    else {
      // and then check role in user
      if (this.props.isAdmin) {
        return true
      } else {
        return objectPath.get(this.props.authRole, role)
      }
    }
  }

  render() {
    // const { pathname } = this.props.location
    const isOpen = this.props.isOpenNavigation
    //&& pathname !== slug.monitoringList.base

    return (
      <SidebarWrapper isShow={this.props.isShow}>
        <ToggleResize
          isShow={this.props.isShow}
          onToggle={this.props.onToggle}
        />
        <LogoBrandName />
        <SimpleBarReact style={{ maxHeight: 'calc(100vh - 71.99px)' }}>
          <Menu
            onClick={this.handleClick}
            style={{
              width: 'auto',
              minWidth: isOpen ? 240 : 'initial',
              backgroundColor: '#F4F5F7',
              marginLeft: isOpen ? -8 : -18,
            }}
            defaultSelectedKeys={[this.props.menuSelected]}
            // defaultOpenKeys={this.props.openSubMenu}
            openKeys={this.props.openSubMenu}
            onOpenChange={openKeys => {
              // console.log('this.props.menuSelected',this.props.menuSelected)
              this.props.changeOpenSubMenu(openKeys)
            }}
            selectedKeys={[this.props.menuSelected]}
            mode="inline"
            // inlineCollapsed={!isOpen}
          >
            {/* Dashboard */}
            {protectRole(ROLE.DASHBOARD.VIEW)(
              <Menu.Item key={slug.dashboard}>
                <Tooltip placement="right" title={TOOLTIP_MENU.dashboard}>
                  <Link
                    style={CENTER}
                    to={slug.dashboard}
                    onClick={() => {
                      this.props.selectMenu(slug.dashboard)
                    }}
                  >
                    {Icon.dashboard}
                    <span style={{ marginLeft: 12 }}>
                      {MENU_NAME.dashboard}
                    </span>
                  </Link>
                </Tooltip>
              </Menu.Item>
            )}

            {this.checkRoleForGroup([
              ROLE.MONITORING.VIEW,
              ROLE.MONITORING_BY_LIST.VIEW,
              ROLE.MAP.VIEW,
              ROLE.CAMERA.VIEW,
              ROLE.DATA_SEARCH.VIEW,
              ROLE.AVG_SEARCH.VIEW,
            ]) && MonitoringMenu.renderComp(this.props)}

            {this.checkRoleForGroup([
              ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.VIEW,
              ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW,
            ]) && HandleDataMenu.renderComp(this.props)}

            {this.checkRoleForGroup([ROLE.STATION_AUTO.VIEW]) &&
              StationFixedMenu.renderComp(this.props)}

            {this.checkRoleForGroup([
              ROLE.QAQCCONFIG.VIEW,
              ROLE.FTPTRANSFER.VIEW,
            ]) && ShareDataMenu.renderComp(this.props)}

            {/* TODO  Chưa có role nên dùng tạm của STATION_AUTO, xem lại */}
            {this.checkRoleForGroup([
              ROLE.TILE_DULIEU_THUDUOC.VIEW,
              // ROLE.TILE_DULIEU.VIEW,
              ROLE.TB24H.VIEW,
              ROLE.TB1H.VIEW,
              ROLE.TB1MAX.VIEW,
              ROLE.TB8MAX.VIEW,
              ROLE.TILE_DULIE_VUOTNGUONG.VIEW,
              ROLE.SO_LAN_MAT_KET_NOI.VIEW,
              ROLE.TINH_TRANG_DU_LIEU.VIEW,
            ]) && ReportMenu.renderComp(this.props)}

            {this.checkRoleForGroup([
              ROLE.AQI.VIEW,
              ROLE.WQI.VIEW,
              ROLE.WQI_NGAY.VIEW,
              ROLE.WQI_GIO.VIEW,
              ROLE.AQI_GIO.VIEW,
              ROLE.AQI_NGAY.VIEW,
              ROLE.CONFIG_WQI.VIEW,
              ROLE.CAU_HINH_TINH_TOAN_AQI.VIEW,
              ROLE.CAU_HINH_TINH_TOAN_WQI.VIEW,
            ]) && AdvanceMenu.renderComp(this.props)}

            {this.checkRoleForGroup([
              ROLE.STATION_AUTO.VIEW,
              ROLE.CAU_HINH_KET_NOI.VIEW,
              ROLE.CAU_HINH_GUI_CANH_BAO.VIEW,
              ROLE.CAU_HINH_LAY_MAU.VIEW,
              ROLE.CONFIG_COLOR_NOTI.VIEW,
              ROLE.CAU_HINH_CAMERA.VIEW,
              ROLE.MEASURING.VIEW,
              ROLE.STATION_TYPE.VIEW,
              ROLE.PROVINCE.VIEW,
              ROLE.QCVN.VIEW,
              ROLE.ROLE.VIEW,
              ROLE.USER.VIEW,
              ROLE.XEM_NHAT_KY.VIEW,
            ]) && ConfigMenu.renderComp(this.props)}
          </Menu>
        </SimpleBarReact>
      </SidebarWrapper>
    )
  }
}
