import PropTypes from 'prop-types'
import React from 'react'
import { Menu } from 'antd'
import slug, { MENU_NAME, MENU_GROUP } from 'constants/slug'
import protectRole from 'hoc/protect-role/index.backup'
import ROLE from 'constants/role'
import Icon from 'themes/icon'
import { Link } from 'react-router-dom'

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.ADVANCE}
      title={
        <div style={CENTER}>
          {Icon.advance}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.advanceSub}</span>
        </div>
      }
    >
      {protectRole(ROLE.AQI.VIEW)(
        <Menu.Item
          key={slug.aqi.base}
          onClick={() => {
            props.selectMenu(slug.aqi.base)
          }}
        >
          <Link to={slug.aqi.base}>{MENU_NAME.advance.aqiMap}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.STATISTIC.AQI)(
        <Menu.Item
          key={slug.statistic.aqi}
          onClick={() => {
            props.selectMenu(slug.statistic.aqi)
          }}
        >
          <Link to={slug.statistic.aqi}>{MENU_NAME.advance.aqiStatistic}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.WQI.VIEW)(
        <Menu.Item
          key={slug.wqi.base}
          onClick={() => {
            props.selectMenu(slug.wqi.base)
          }}
        >
          <Link to={slug.wqi.base}>{MENU_NAME.advance.wqiMap}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.STATISTIC.WQI)(
        <Menu.Item
          key={slug.statistic.wqi}
          onClick={() => {
            props.selectMenu(slug.statistic.wqi)
          }}
        >
          <Link to={slug.statistic.wqi}>{MENU_NAME.advance.wqiStatistic}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.CONFIG_WQI.VIEW)(
        <Menu.Item
          key={slug.configWQI.base}
          onClick={() => {
            props.selectMenu(slug.configWQI.base)
          }}
        >
          <Link to={slug.configWQI.base}>{MENU_NAME.advance.config}</Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  )
}
