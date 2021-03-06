import { Menu, Tooltip } from 'antd'
import ROLE from 'constants/role'
import slug, { listMenuName, listTooltipMenu, MENU_GROUP } from 'constants/slug'
import { translate as t } from 'hoc/create-lang'
import protectRole from 'hoc/protect-role/forMenu'
import React from 'react'
import { Link } from 'react-router-dom'

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
            <img
              style={{ height: 22, width: 22 }}
              alt="alarm"
              src="/images/menu-app/alarm.svg"
            />
            <div style={{ marginLeft: 12 }}>{listMenuName().alarm}</div>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.ALARM_MANAGEMENT.VIEW)(
        <Menu.Item
          key={slug.alarm.management}
          onClick={() => {
            props.selectMenu(slug.alarm.management)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().alarm.management}>
            <Link to={slug.alarm.management}>{t('alarm.menu.management')}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.ALARM_HISTORY.VIEW)(
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

      {protectRole(ROLE.ALARM_HISTORY.VIEW)(
        <Menu.Item
          key={slug.alarm.setting}
          onClick={() => {
            props.selectMenu(slug.alarm.setting)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().alarm.setting}>
            <Link to={slug.alarm.setting}>{t('alarm.menu.setting')}</Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
