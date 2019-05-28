import PropTypes from "prop-types";
import React from "react";

import { autobind } from "core-decorators";
import ArrowLeftIcon from "@atlaskit/icon/glyph/arrow-left";
import Tooltip from "@atlaskit/tooltip";
import { withRouter } from "react-router-dom";
import Link from "components/elements/link";
import slug from "constants/slug";
import StyleWrapper from "./StyleWrapper";
import LogoSubIcon from "./LogoSubIcon";
import DocumentIcon from "@atlaskit/icon/glyph/question-circle";
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import DocumentDrawer from "./DocumentDrawer";
import AppDrawer from "./AppDrawer";
import ChangeLanguage from "./ChangeLanguage";
import LogoBrandName from "./LogoBrandName";
import { translate } from "hoc/create-lang";
import { deleteToken } from "api/NotificationApi";
import Navigation, { AkNavigationItem, AkGlobalItem, createGlobalTheme } from '@atlaskit/navigation'
import AkDropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu'
import styled from 'styled-components'
// import { componentDidMount } from 'react-google-maps/lib/utils/MapChildHelper';
/* 
-------------------------------
 */
import { connectAutoDispatch } from 'redux/connect'
import { getTotalByNotificationType, setDrawerVisible, resetAllCounts } from 'redux/actions/notification'
import { getListOfStationAuto } from "redux/actions/stationAuto";
import { logout } from 'redux/actions/authAction'
import AvatarCharacter from 'components/elements/avatar-character'
import { Badge} from 'antd'
import NotificationDrawer from './NotificationDrawer'

const WrapperTitle = styled.div`
  margin-left: -8px;
  margin-right: -8px;
`;

const globalTheme = createGlobalTheme("#ffffff", "#1d89ce");
@connectAutoDispatch(
  state => ({
    authInfo: state.auth.userInfo,
    notificationCount: state.notification.count,
    drawerVisible: state.notification.visible,
    tokenFCM: state.auth.tokenFCM
  }),
  { 
    logout, 
    getListOfStationAuto,
    getTotalByNotificationType, setDrawerVisible, resetAllCounts
  }
)
@withRouter
@autobind
export default class BasicNestedNavigation extends React.Component {
  static propTypes = {
    isShowBack: PropTypes.bool,
    hide: PropTypes.bool,
    onBack: PropTypes.func,
    onChangeSize: PropTypes.func,
    logout: PropTypes.func,
    navigation: PropTypes.object,
    /* Redux's props */
    drawerVisible: PropTypes.bool.isRequired,
    notificationCount: PropTypes.object.isRequired,
    stationAuto: PropTypes.array.isRequired,
    getTotalByNotificationType: PropTypes.func.isRequired,
    setDrawerVisible: PropTypes.func.isRequired,
    resetAllCounts: PropTypes.func.isRequired
  }

  static defaultProps = {
    navigation: {
      isOpen: true,
      width: 320
    }
  };

  state = {
    drawers: {
      create: false
    },
    isShowNotifyDrawer: false,
  }

  toggleDrawer(type) {
    window.open('http://help.ilotusland.com', '_blank')
    // console.log(this.state.drawers,"toggleDrawer")
    // this.setState({
    //   drawers: {
    //     ...this.state.drawers,
    //     [type]: !this.state.drawers[type]
    //   }
    // })
  }

  getContainerHeaderComponent = logo => {
    const backButton = this.props.isShowBack ? <AkNavigationItem icon={<ArrowLeftIcon label="Back" />} onClick={this.props.onBack} text="Back" key="2" /> : null

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    if (!this.props.navigation.isOpen) return [];
    return [
      <Tooltip key="1" position="right" content="Admin system">
        <WrapperTitle>
          <Link to="/">
            <LogoBrandName logo={logo} />
          </Link>
        </WrapperTitle>
      </Tooltip>,
      backButton
    ];
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  };

  handleLogout() {
    this.props.logout();
    deleteToken(this.props.tokenFCM, this.props.authInfo.email);
    this.props.resetAllCounts() //action
    this.props.history.push("/login");
  }

  handleChangePassword() {
    this.props.history.push(slug.user.changePassword);
  }

  handleProfile() {
    this.props.history.push(slug.user.profile);
  }
  handleSecurity() {
    this.props.history.push(slug.user.security);
  }
  handleConfigStation() {
    this.props.history.push(slug.user.configStation);
  }

  /* NOTE  UI-NAVIGATOR-BELOW (list of icons same position as language) */
  globalSecondaryActions() {
    return [
      /* MARK  icon notification */
      <Badge style={{cursor: 'pointer'}} count={this.props.notificationCount.total} onClick={() => this.props.setDrawerVisible(true)}>
        <NotificationIcon size="large" />
      </Badge>,
      <AkDropdownMenu
        appearance="tall"
        position="right bottom"
        trigger={
          <AkGlobalItem>
            <Tooltip position="right" content={translate('profileUser.title')}>
              <AvatarCharacter size={32} username={this.props.authInfo.email} avatarUrl={this.props.authInfo.avatar} />
            </Tooltip>
          </AkGlobalItem>
        }
      >
        <DropdownItemGroup title={`${this.props.authInfo.lastName} ${this.props.authInfo.firstName}`}>
          <DropdownItem onClick={this.handleProfile}>{translate('profileUser.viewProfile')}</DropdownItem>
          <DropdownItem onClick={this.handleChangePassword}>{translate('profileUser.changePassword')}</DropdownItem>
          {/* TASK  JIRA::ILOTUSLAND-98 */}
          {/* <DropdownItem onClick={this.handleConfigStation}>{translate('profileUser.configStation')}</DropdownItem> */}
          <DropdownItem onClick={this.handleSecurity}>{translate('profileUser.security')}</DropdownItem>
          <DropdownItem onClick={this.handleLogout}>{translate('profileUser.logOut')}</DropdownItem>
        </DropdownItemGroup>
      </AkDropdownMenu>,
      <ChangeLanguage />
    ];
  }

  handleResize(e) {
    if (this.props.onChangeSize) {
      this.props.onChangeSize(e);
    }
  }

  renderDrawer(Component, key) {
    return <Component key={key} onBackButton={() => this.toggleDrawer(key)} isOpen={this.state.drawers[key] ? true : false} primaryIcon={<span />} />
  }

  renderIconDrawer = (IconComponent, key, content) => {
    return (
      <AkGlobalItem size="medium" onClick={() => this.toggleDrawer(key)}>
        <Tooltip position="right" content={content}>
          <IconComponent label={content} secondaryColor="inherit" size="medium" />
        </Tooltip>
      </AkGlobalItem>
    );
  }

  async componentDidMount() {
    this.props.getTotalByNotificationType(this.props.notificationCount)
    this.props.getListOfStationAuto()
  }

  render() {
    let logo = ''
    if (this.props.authInfo.organization) {
      logo = this.props.authInfo.organization.logo;
    }

    return (
      <StyleWrapper>
        <Navigation
          globalTheme={globalTheme}
          // containerTheme={presetThemes.global}
          width={this.props.hide ? 0 : this.props.navigation.width}
          globalPrimaryIcon={<LogoSubIcon />}
          containerHeaderComponent={() => this.getContainerHeaderComponent(logo)}
          onResize={this.handleResize}
          isOpen={this.props.navigation.isOpen}
          drawers={[this.renderDrawer(DocumentDrawer, 'document'), this.renderDrawer(AppDrawer, 'app')]}
          globalPrimaryActions={[this.renderIconDrawer(DocumentIcon, 'document', 'Document')]}
          globalSecondaryActions={this.globalSecondaryActions()}
        >
          {this.props.children}
        </Navigation>
        
        {/* NOTE  NOTIFICATION COMPONENT */}
        <NotificationDrawer 
          closeDrawer={() => this.props.setDrawerVisible(false)}
          visible={this.props.drawerVisible}
        />
      </StyleWrapper>
    );
  }
}
