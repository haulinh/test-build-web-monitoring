import { TreeSelect } from 'antd'
import { get, isNil } from 'lodash-es'
import React, { Component } from 'react'
const { SHOW_PARENT } = TreeSelect
export default class TreeSelectUser extends Component {
  getRoleDependentUser = () => {
    const { roles, users } = this.props

    const roleDependentUser = roles
      .map(role => {
        const usersOfRole = users.filter(
          user => get(user, 'role._id', '') === role._id
        )
        return {
          title: role.name,
          value: users
            .filter(user => get(user, 'role._id', '') === role._id)
            .map(user => user._id),
          key: role._id,
          children: usersOfRole.map(user => ({
            title: user.lastName + ' ' + user.firstName,
            value: user._id,
            key: user._id,
          })),
        }
      })
      .filter(item => item.children.length !== 0)
    const usersOfOtherRole = users.filter(user => isNil(user.role))
    const otherRoleIndependentUser = {
      title: 'Người dùng khác',
      value: users.filter(user => isNil(user.role)).map(user => user._id),
      key: '1',
      children: usersOfOtherRole.map(user => ({
        title: user.lastName + ' ' + user.firstName,
        value: user._id,
        key: user._id,
      })),
    }
    return [...roleDependentUser, otherRoleIndependentUser]
  }

  getTreeData = () => {
    const treeData = this.getRoleDependentUser()
    return treeData
  }

  handleOnChange = value => {
    const { roles, users, onChange } = this.props

    const roleIds = roles.map(role => role._id)

    const userIds = value.reduce((baseUserIds, current) => {
      if (roleIds.includes(current)) {
        const usersOfRole = users
          .filter(user => user.role._id === current)
          .map(user => user._id)

        return [...baseUserIds, ...usersOfRole]
      }
      return [...baseUserIds, current]
    }, [])
    if (onChange) {
      onChange(userIds)
    }
  }

  render() {
    const tProps = {
      treeData: this.getTreeData(),
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      onChange: this.handleOnChange,
      maxTagCount: 5,
      style: {
        width: '100%',
      },
      allowClear: true,
    }

    return <TreeSelect {...tProps} {...this.props} />
  }
}
