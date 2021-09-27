import React from 'react'
import { Menu, Tooltip } from 'antd'
import slug, { MENU_GROUP, listTooltipMenu, listMenuName } from 'constants/slug'
import protectRole from 'hoc/protect-role/forMenu'
import ROLE from 'constants/role'
import Icon from 'themes/icon'
import { Link } from 'react-router-dom'

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.DASHBOARD}
      title={
        <Tooltip placement="right" title={listTooltipMenu().dashboard.base}>
          <div style={CENTER}>
            {Icon.dashboard}
            <span style={{ marginLeft: 12 }}>
              {listMenuName().dashboard.base}
            </span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.DASHBOARD.VIEW)(
        <Menu.Item
          key={slug.dashboard.healthCheck}
          onClick={() => {
            props.selectMenu(slug.dashboard.healthCheck)
          }}
        >
          <Tooltip
            placement="right"
            title={listMenuName().dashboard.healthCheck}
          >
            <Link to={slug.dashboard.healthCheck}>
              {listMenuName().dashboard.healthCheck}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.DASHBOARD_2.VIEW)(
        <Menu.Item
          key={slug.dashboard.overview}
          onClick={() => {
            props.selectMenu(slug.dashboard.overview)
          }}
        >
          <Tooltip placement="right" title={listMenuName().dashboard.overview}>
            <Link to={slug.dashboard.overview}>
              {listMenuName().dashboard.overview}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
