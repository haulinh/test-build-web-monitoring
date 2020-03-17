import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { autobind } from "core-decorators";
// import { AkContainerNavigationNested } from '@atlaskit/navigation'
import { getIndexLocationWithNavigationRouter } from "utils/sidebarNavigation";
import navigationRouterStack from "navigation/sidebarNavigation/mainNavigationRouter";
import NavigationLayout from "../navigation-layout";
import { connect } from "react-redux";
import { Menu } from "antd";
import { remove as _remove, join as _join } from "lodash";
// import {
//   dashboardMenu,
//   monitoringMenu,
//   handleDataMenu,
//   shareDataMenu,
//   advanceMenu,
//   configMenu,
//   DashboardMenu
// } from 'navigation/sidebarNavigation/mainNavigationRouterNew'
// mainNavigationRouterNew

import { Link } from "react-router-dom";
import Icon from "themes/icon";
import slug, { parentMenuFromSub, MENU_NAME } from "constants/slug";
// import { translate } from 'hoc/create-lang'
import { selectMenu, changeOpenSubMenu } from "redux/actions/themeAction";
// import { adapt } from "chromatism";
import protectRole from "hoc/protect-role/forMenu";
import ROLE from "constants/role";
import MonitoringMenu from "./MenuMonitoring";
import HandleDataMenu from "./HandleDataMenu";
import ShareDataMenu from "./ShareDataMenu";
import ReportMenu from "./ReportMenu";
import AdvanceMenu from "./AdvanceMenu";
import ConfigMenu from "./ConfigMenu";
import objectPath from "object-path";

const CENTER = {
  display: "flex",
  alignItems: "center",
  fontWeight: 600
};

// const SubMenu = Menu.SubMenu
// const MenuItemGroup = MenuItemGroup

@connect(state => ({
  isOpenNavigation: state.theme.navigation.isOpen
}))
@withRouter
@autobind
export default class DefaultSidebarNavigation extends React.PureComponent {
  static propTypes = {
    withtootips: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      stack: props.location.pathname
        ? this.getStackInitial(props)
        : [navigationRouterStack]
    };
  }

  getStackInitial(props) {
    const navigationIndex = getIndexLocationWithNavigationRouter(
      props.location,
      navigationRouterStack
    );
    if (
      navigationIndex > -1 &&
      navigationRouterStack[navigationIndex].childMenu
    ) {
      return [
        navigationRouterStack,
        navigationRouterStack[navigationIndex].childMenu
      ];
    }
    return [navigationRouterStack];
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.props.location.pathname !== nextProps.location.pathname ||
  //     this.state.stack.length !== nextState.stack.length ||
  //     this.props.navigation.isOpen !== nextProps.navigation.isOpen ||
  //     this.props.navigation.width !== nextProps.navigation.width
  //   )
  // }

  stackPush(newPage) {
    const stack = [...this.state.stack, newPage];
    this.setState({ stack });
  }

  stackPop() {
    if (this.state.stack.length <= 1) {
      return false;
    }

    const stack = this.state.stack.slice(0, this.state.stack.length - 1);
    return this.setState({ stack });
  }

  renderItem(item) {
    const navigationIndex = getIndexLocationWithNavigationRouter(
      this.props.location,
      navigationRouterStack
    );
    const onClick = item.childMenu
      ? () => this.stackPush(item.childMenu)
      : () => console.log(`Link item clicked: '${item.component.props.text}'`);
    const text = item.component.props.text;
    const itemHref = item.component.props.href ? item.component.props.href : "";
    const pathname = this.props.location.pathname;
    const isSelected =
      item.url === pathname ||
      (pathname !== "/" &&
        pathname.indexOf(itemHref) > -1 &&
        itemHref !== "/") ||
      // check navigation parent index
      (navigationIndex > -1
        ? navigationRouterStack[navigationIndex].component.props.text === text
        : false);
    //        (pathname !== '/' && pathname.indexOf(itemHref) > -1)
    // console.log(itemHref + ' vs ' + pathname)
    // console.log(isSelected)
    return React.cloneElement(item.component, {
      key: text,
      onClick,
      isSelected: isSelected
    });
  }

  renderStack() {
    return this.state.stack.map(page =>
      page.map(item => this.renderItem(item))
    );
  }

  render() {
    return (
      <NavigationLayout
        onChangeSize={this.props.onChangeSize}
        isShowBack={this.state.stack.length > 1}
        onBack={this.stackPop}
        navigation={this.props.navigation}
      >
        {this.props.isOpenNavigation && <MenuApp />}
        {/* <AkContainerNavigationNested stack={this.renderStack()} /> */}
      </NavigationLayout>
    );
  }
}

@withRouter
@connect(
  state => ({
    isOpenNavigation: state.theme.navigation.isOpen,
    menuSelected: state.theme.menuSelected,
    openSubMenu: state.theme.openSubMenu,

    authRole: state.auth.userInfo.role,
    isAdmin: state.auth.userInfo.isAdmin,
    organization: state.auth.userInfo.organization
  }),
  {
    selectMenu,
    changeOpenSubMenu
  }
)
class MenuApp extends React.PureComponent {
  state = {
    openSubMenu: ["monitoring"]
  };
  componentDidMount() {
    // set menu selected
    const pathname = this.props.location.pathname;
    let menuSelect = pathname;

    // set expand menu
    let menuExpande = parentMenuFromSub[pathname];
    if (!menuExpande) {
      let pathObj = this.getPath(pathname);
      menuExpande = parentMenuFromSub[pathObj.menuExpande];
      menuSelect = pathObj.menuSelect;
      console.log(pathObj.menuExpande, "menuSelect");
    }

    this.props.selectMenu(menuSelect);
    // this.props.changeOpenSubMenu([...this.props.openSubMenu, menuExpande])
    this.props.changeOpenSubMenu([menuExpande]);
  }

  getPath(path) {
    let result = "";

    let tampArr = path.split("/");

    // console.log(tampArr, "tampArr")
    const menuExpande = "/" + tampArr[1];
    let isStop = false;
    _remove(tampArr, item => {
      if (item.includes("edit") || item.includes("create")) {
        isStop = true;
      }
      return isStop;
    });

    result = _join(tampArr, "/");
    return {
      menuSelect: result,
      menuExpande: menuExpande
    };
  }

  checkRoleForGroup(otherKeyRoles) {
    let isShow = false;
    otherKeyRoles.forEach(oKeyRole => {
      if (this.checkRole(oKeyRole)) isShow = true;
    });
    return isShow;
  }

  checkRole(role) {
    // check role in organization first
    let isRole = objectPath.get(this.props.organization, role);
    if (!isRole) return isRole;
    else {
      // and then check role in user
      if (this.props.isAdmin) {
        return true;
      } else {
        return objectPath.get(this.props.authRole, role);
      }
    }
  }

  render() {
    const { pathname } = this.props.location;
    const isOpen =
      this.props.isOpenNavigation && pathname !== slug.monitoringList.base;

    return (
      <Menu
        onClick={this.handleClick}
        style={{
          width: "auto",
          minWidth: isOpen ? 240 : "initial",
          backgroundColor: "#F4F5F7",
          marginLeft: isOpen ? -8 : -18
        }}
        defaultSelectedKeys={[this.props.menuSelected]}
        // defaultOpenKeys={this.props.openSubMenu}
        openKeys={this.props.openSubMenu}
        onOpenChange={openKeys => {
          // console.log('this.props.menuSelected',this.props.menuSelected)
          this.props.changeOpenSubMenu(openKeys);
        }}
        selectedKeys={[this.props.menuSelected]}
        mode="inline"
        inlineCollapsed={!isOpen}
      >
        {/* Dashboard */}
        {protectRole(ROLE.DASHBOARD.VIEW)(
          <Menu.Item key={slug.dashboard}>
            <Link
              style={CENTER}
              to={slug.dashboard}
              onClick={() => {
                this.props.selectMenu(slug.dashboard);
              }}
            >
              {Icon.dashboard}
              <span style={{ marginLeft: 12 }}>{MENU_NAME.dashboard}</span>
            </Link>
          </Menu.Item>
        )}

        {this.checkRoleForGroup([
          ROLE.MONITORING.VIEW,
          ROLE.MAP.VIEW,
          ROLE.CAMERA.VIEW,
          ROLE.DATA_SEARCH.VIEW,
          ROLE.AVG_SEARCH.VIEW,
          ROLE.REPORT.VIEW,
          ROLE.MONITORING_BY_LIST.VIEW
        ]) && MonitoringMenu.renderComp(this.props)}

        {this.checkRoleForGroup([
          ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.VIEW,
          ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW
        ]) && HandleDataMenu.renderComp(this.props)}

        {this.checkRoleForGroup([
          ROLE.QAQCCONFIG.VIEW,
          ROLE.FTPTRANSFER.VIEW
        ]) && ShareDataMenu.renderComp(this.props)}

        {/* TODO  Chưa có role nên dùng tạm của STATION_AUTO, xem lại */}
        {this.checkRoleForGroup([
          ROLE.TILE_DULIEU_THUDUOC.VIEW,
          ROLE.TILE_DULIEU.VIEW,
          ROLE.TB24H.VIEW,
          ROLE.TB1H.VIEW,
          ROLE.TB1MAX.VIEW,
          ROLE.TB8MAX.VIEW,
          ROLE.TILE_DULIE_VUOTNGUONG.VIEW,
          ROLE.SO_LAN_MAT_KET_NOI.VIEW,
          ROLE.TINH_TRANG_DU_LIEU.VIEW,
          ROLE.WQI_GIO.VIEW,
          ROLE.AQI_GIO.VIEW,
          ROLE.AQI_NGAY.VIEW
        ]) && ReportMenu.renderComp(this.props)}

        {this.checkRoleForGroup([
          ROLE.MAP.VIEW,
          ROLE.WQI.VIEW,
          ROLE.CONFIG_WQI.VIEW
        ]) && AdvanceMenu.renderComp(this.props)}

        {this.checkRoleForGroup([
          ROLE.STATION_AUTO.VIEW,
          ROLE.MEASURING.VIEW,
          ROLE.STATION_TYPE.VIEW,
          ROLE.PROVINCE.VIEW,
          ROLE.QCVN.VIEW,
          ROLE.ROLE.VIEW,
          ROLE.USER.VIEW
        ]) && ConfigMenu.renderComp(this.props)}
        
      </Menu>
    );
  }
}
