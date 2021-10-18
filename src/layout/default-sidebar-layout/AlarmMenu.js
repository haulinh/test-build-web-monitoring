import { Menu, Tooltip, Icon as IconAntd } from 'antd'
import ROLE from 'constants/role'
import slug, { MENU_GROUP, listTooltipMenu, listMenuName } from 'constants/slug'
import protectRole from 'hoc/protect-role/forMenu'
import React from 'react'
import { Link } from 'react-router-dom'
import { translate as t } from 'hoc/create-lang'

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.ALARM}
      title={
        <Tooltip placement="right" title={listTooltipMenu().alarm.management}>
          <div style={CENTER}>
            <img alt="alarm" src="/images/menu-app/alarm.svg" />
            <span style={{ marginLeft: 12 }}>{listMenuName().alarm}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.INCIDENT_MANAGEMENT.VIEW)(
        <Menu.Item
          key={slug.ticket.incident}
          onClick={() => {
            props.selectMenu(slug.alarm.management)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().alarm.management}>
            <Link to={slug.alarm.management}>{t('alarm.menu.management')}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.INCIDENT_CONFIG_PROPERTIES.VIEW)(
        <Menu.Item
          key={slug.alarm.history}
          onClick={() => {
            props.selectMenu(slug.alarm.history)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().alarm.history}>
            <Link to={slug.alarm.history}>{t('alarm.menu.history')}</Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
