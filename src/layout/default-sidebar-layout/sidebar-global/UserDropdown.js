import React from 'react'
import { connectAutoDispatch } from 'redux/connect'
import { autobind } from 'core-decorators'
import { translate } from 'hoc/create-lang'
import { AkGlobalItem } from '@atlaskit/navigation'
import AkDropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu'
import { withRouter } from 'react-router-dom'
import Tooltip from '@atlaskit/tooltip'
import AvatarCharacter from 'components/elements/avatar-character'
import { logout } from 'redux/actions/authAction'
import { deleteToken } from 'api/NotificationApi'
import { resetAllCounts } from 'redux/actions/notification'
import slug from 'constants/slug'
import _ from 'lodash'

@connectAutoDispatch(
  state => ({
    authInfo: state.auth.userInfo,
    tokenFCM: state.auth.tokenFCM,
  }),
  {
    logout,
    resetAllCounts,
  }
)
@withRouter
@autobind
export default class UserDropdown extends React.PureComponent {
  handleLogout() {
    const userId = _.get(this.props.authInfo, '_id')
    this.props.logout(userId)
    deleteToken(this.props.tokenFCM, this.props.authInfo.email)
    this.props.resetAllCounts() //action
    this.props.history.push('/login')
  }

  handleChangePassword() {
    this.props.history.push(slug.user.changePassword)
  }

  handleInfoLicense() {
    this.props.history.push(slug.user.infoLicense)
  }

  handleProfile() {
    this.props.history.push(slug.user.profile)
  }
  handleSecurity() {
    this.props.history.push(slug.user.security)
  }
  handleConfigStation() {
    this.props.history.push(slug.user.configStation)
  }

  render() {
    return (
      <AkDropdownMenu
        appearance="tall"
        position="right bottom"
        trigger={
          <AkGlobalItem>
            <Tooltip position="right" content={translate('profileUser.title')}>
              <AvatarCharacter
                size={32}
                username={this.props.authInfo.email}
                avatarUrl={this.props.authInfo.avatar}
              />
            </Tooltip>
          </AkGlobalItem>
        }
      >
        <DropdownItemGroup
          title={`${this.props.authInfo.lastName} ${
            this.props.authInfo.firstName
          }`}
        >
          <DropdownItem onClick={this.handleInfoLicense}>
            {translate('profileUser.infoLicense')}
          </DropdownItem>
          <DropdownItem onClick={this.handleProfile}>
            {translate('profileUser.viewProfile')}
          </DropdownItem>
          <DropdownItem onClick={this.handleChangePassword}>
            {translate('profileUser.changePassword')}
          </DropdownItem>
          <DropdownItem onClick={this.handleConfigStation}>
            {translate('profileUser.configStation')}
          </DropdownItem>
          <DropdownItem onClick={this.handleSecurity}>
            {translate('profileUser.security')}
          </DropdownItem>
          <DropdownItem onClick={this.handleLogout}>
            {translate('profileUser.logOut')}
          </DropdownItem>
        </DropdownItemGroup>
      </AkDropdownMenu>
    )
  }
}
