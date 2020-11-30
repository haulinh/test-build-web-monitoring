import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isReact from 'is-react'
import objectPath from 'object-path'
import { Popover } from 'antd'
import { get } from 'lodash'

import { translate as t } from 'hoc/create-lang'

const createProtectRole = (
  keyRole = '',
  otherKeyRoles = [],
  type = 'item'
) => Component => {
  @connect(state => ({
    authRole: state.auth.userInfo.role,
    isAdmin: state.auth.userInfo.isAdmin,
    organization: state.auth.userInfo.organization,
  }))
  class ProtectRole extends React.Component {
    // check nested keyRole in object
    // Ex: menu.dashboard.view
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

    getRoleForItem() {
      return this.checkRole(keyRole)
    }

    getRoleForGroup() {
      let isShow = false
      otherKeyRoles.forEach(oKeyRole => {
        if (this.checkRole(oKeyRole)) isShow = true
      })
      return isShow
    }

    getRole() {
      switch (type) {
        case 'item':
          return this.getRoleForItem()
        case 'group':
          return this.getRoleForGroup()
        default:
          return this.getRoleForItem()
      }
    }

    renderComponent(otherProps) {
      if (isReact.component(Component)) {
        return <Component {...otherProps} />
      } else
        return React.cloneElement(Component, {
          ...otherProps,
          key: Component.key,
        })
    }

    render() {
      let { authRole, isAdmin, dispatch, ...otherProps } = this.props

      //if role undefined||false return empty
      //if (!this.getRole()) return null
      if (this.getRole()) {
        if (isReact.component(Component)) {
          return <Component {...otherProps} />
        } else
          return React.cloneElement(Component, {
            ...otherProps,
            key: Component.key,
          })
      } else {
        if (type === 'input') {
          return this.renderComponent({
            ...otherProps,
            disabled: true,
          })
        }
        return null
      }
    }
  }

  if (isReact.component(Component)) {
    return ProtectRole
  } else return <ProtectRole {...Component.props} />
}

const PopoverCustom = styled(Popover)`
  .ant-popover-inner-content {
    display: none;
  }
`

@connect(state => ({
  authRole: state.auth.userInfo.role,
  isAdmin: state.auth.userInfo.isAdmin,
  organization: state.auth.userInfo.organization,
}))
export class PermissionPopover extends React.Component {
  static propTypes = {
    organization: PropTypes.object,
    isAdmin: PropTypes.bool,
    authRole: PropTypes.object,
    popoverTitle: PropTypes.string,
    popoverPlacement: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
      .isRequired,
    roles: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  }

  static defaultProps = {
    popoverPlacement: 'top',
    popoverTitle: t('global.noPermission'),
  }

  checkPermission() {
    const { organization, authRole, isAdmin, roles } = this.props

    if (isAdmin) return true
    if (typeof roles === 'string')
      return get(organization, roles) || get(authRole, roles)
    for (let i = 0; i < roles.length; i++) {
      if (get(organization, roles[i]) || get(authRole, roles[i])) return true
    }
    return false
  }

  render() {
    const { children, popoverPlacement, popoverTitle } = this.props
    const hasPermission = this.checkPermission()

    if (typeof children === 'function') {
      if (hasPermission) return children(hasPermission)
      return (
        <PopoverCustom
          title={popoverTitle}
          placement={popoverPlacement}
          getTooltipContainer={ele => ele}
        >
          {children(hasPermission)}
        </PopoverCustom>
      )
    }

    return hasPermission ? children : null
  }
}

export default createProtectRole
