import React from 'react'
import { connect } from 'react-redux'
import isReact from 'is-react'
import objectPath from 'object-path'

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
        return  this.renderComponent({
          ...otherProps
        })
        
      } else {
        if (type === 'input') {
          return  this.renderComponent({
            ...otherProps,
            disabled: true
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

export default createProtectRole
