import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import styled from 'styled-components'

import { PublicApis } from '../constants'

const { SubMenu, Item } = Menu

const MenuWrapper = styled(Menu)`
  height: 100%;
  background: #f4f5f7;
  border-left: 1px solid #f1f1f1;
  .ant-menu-inline {
    width: unset;
    margin-left: 24px;
  }
`
export default class APIList extends Component {
  render() {
    const { onClickMenu, defaultSelectedKeys, defaultOpenKeys } = this.props

    return (
      <MenuWrapper
        mode="inline"
        onClick={onClickMenu}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
      >
        {Object.values(PublicApis).map(menu => (
          <SubMenu key={menu.key} title={menu.name} className="submenu">
            {Object.values(menu.endpoints).map(child => (
              <Item key={child.key}>{child.name}</Item>
            ))}
          </SubMenu>
        ))}
      </MenuWrapper>
    )
  }
}

APIList.propTypes = {
  onClickMenu: PropTypes.func.isRequired,
}
