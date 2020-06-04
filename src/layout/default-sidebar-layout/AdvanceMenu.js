// import PropTypes from 'prop-types'
import React from 'react'
import { Menu } from 'antd'
import slug, { MENU_NAME, MENU_GROUP } from 'constants/slug'
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
          key={slug.map.aqi}
          onClick={() => {
            props.selectMenu(slug.map.aqi)
          }}
        >
          <Link to={slug.map.aqi}>{MENU_NAME.monitoring.mapAQI}</Link>
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

      {protectRole(ROLE.WQI_GIO.VIEW)(
        <Menu.Item
          key={slug.report.wqi_hour}
          onClick={() => {
            props.selectMenu(slug.report.wqi_hour)
          }}
        >
          <Link to={slug.report.wqi_hour}>{MENU_NAME.advance.wqiHour}</Link>
        </Menu.Item>
      )}
      {protectRole(ROLE.WQI_NGAY.VIEW)(
        <Menu.Item
          key={slug.report.wqi_day}
          onClick={() => {
            props.selectMenu(slug.report.wqi_day)
          }}
        >
          <Link to={slug.report.wqi_day}>{MENU_NAME.advance.wqiDay}</Link>
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
  ),
}
