import { Menu } from 'antd'
import React from 'react'
import styled from 'styled-components'

const { SubMenu, Item } = Menu

const MenuWrapper = styled(Menu)`
  width: 100%;
  height: 100vh;
  background: #f4f5f7;
  border-left: 1px solid #f1f1f1;
  .ant-menu-inline {
    width: unset;
    margin-left: 24px;
  }
  .ant-menu-submenu > .ant-menu-submenu-title {
    font-weight: 600;
    color: #3b3b3b;
  }
`

const MenuApiSharing = ({
  onClickMenu,
  defaultSelectedKeys,
  defaultOpenKeys,
  data,
}) => {
  if (!data) return <React.Fragment />

  const handleOnMenuClick = e => {
    onClickMenu(e.key)
  }

  return (
    <MenuWrapper
      mode="inline"
      onClick={handleOnMenuClick}
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
    >
      {data.map(item => (
        <SubMenu key={item.group} title={item.name.vi}>
          {item.api.map(child => (
            <Item key={child.key}>{child.key}</Item>
          ))}
        </SubMenu>
      ))}
    </MenuWrapper>
  )
}

export default MenuApiSharing
