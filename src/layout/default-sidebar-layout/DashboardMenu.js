import React from 'react'
import { Menu, Tooltip } from 'antd'
import slug, { MENU_NAME, MENU_GROUP, TOOLTIP_MENU } from 'constants/slug'
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
        <Tooltip placement="right" title={TOOLTIP_MENU.dashboard.base}>
          <div style={CENTER}>
            {Icon.dashboard}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.dashboard.base}</span>
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
          <Tooltip placement="right" title={MENU_NAME.dashboard.healthCheck}>
            <Link to={slug.dashboard.healthCheck}>
              {MENU_NAME.dashboard.healthCheck}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.DASHBOARD.VIEW)(
        <Menu.Item
          key={slug.dashboard.overview}
          onClick={() => {
            props.selectMenu(slug.dashboard.overview)
          }}
        >
          <Tooltip placement="right" title={MENU_NAME.dashboard.overview}>
            <Link to={slug.dashboard.overview}>
              {MENU_NAME.dashboard.overview}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
