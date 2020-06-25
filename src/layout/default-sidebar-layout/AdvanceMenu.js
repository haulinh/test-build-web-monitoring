// import PropTypes from 'prop-types'
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
      key={MENU_GROUP.ADVANCE}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.advanceSub}>
          <div style={CENTER}>
            {Icon.advance}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.advanceSub}</span>
          </div>
        </Tooltip>
      }
    >
      {/* // NOTE Báo cáo AQI - START */}
      {protectRole(ROLE.AQI.VIEW)(
        <Menu.Item
          key={slug.advance.mapAqi}
          onClick={() => {
            props.selectMenu(slug.advance.mapAqi)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoring.mapAQI}>
            <Link to={slug.advance.mapAqi}>{MENU_NAME.monitoring.mapAQI}</Link>
          </Tooltip>
        </Menu.Item>
      )}
      {protectRole(ROLE.AQI_GIO.VIEW)(
        <Menu.Item
          key={slug.advance.aqi_hour}
          onClick={() => {
            props.selectMenu(slug.advance.aqi_hour)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.report.aqi_hour}>
            <Link to={slug.advance.aqi_hour}>{MENU_NAME.report.aqi_hour}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.AQI_NGAY.VIEW)(
        <Menu.Item
          key={slug.advance.aqi_day}
          onClick={() => {
            props.selectMenu(slug.advance.aqi_day)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.report.aqi_day}>
            <Link to={slug.advance.aqi_day}>{MENU_NAME.report.aqi_day}</Link>
          </Tooltip>
        </Menu.Item>
      )}
      {/* // NOTE Báo cáo AQI - END */}

      {protectRole(ROLE.WQI.VIEW)(
        <Menu.Item
          key={slug.advance.mapWqi}
          onClick={() => {
            props.selectMenu(slug.advance.mapWqi)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.advance.wqiMap}>
            <Link to={slug.advance.mapWqi}>{MENU_NAME.advance.wqiMap}</Link>
          </Tooltip>
        </Menu.Item>
      )}
      {protectRole(ROLE.WQI_GIO.VIEW)(
        <Menu.Item
          key={slug.advance.wqi_hour}
          onClick={() => {
            props.selectMenu(slug.advance.wqi_hour)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.advance.wqiHour}>
            <Link to={slug.advance.wqi_hour}>{MENU_NAME.advance.wqiHour}</Link>
          </Tooltip>
        </Menu.Item>
      )}
      {protectRole(ROLE.WQI_NGAY.VIEW)(
        <Menu.Item
          key={slug.advance.wqi_day}
          onClick={() => {
            props.selectMenu(slug.advance.wqi_day)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.advance.wqiDay}>
            <Link to={slug.advance.wqi_day}>{MENU_NAME.advance.wqiDay}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.CONFIG_WQI.VIEW)(
        <Menu.Item
          key={slug.advance.enableAqiWqi}
          onClick={() => {
            props.selectMenu(slug.advance.enableAqiWqi)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.advance.config}>
            <Link to={slug.advance.enableAqiWqi}>
              {MENU_NAME.advance.config}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
      {/* NOTE  CẤU HÌNH TÍNH TOÁN AQI */}
      {protectRole(ROLE.CAU_HINH_TINH_TOAN_AQI.VIEW)(
        <Menu.Item
          key={slug.advance.configAqi}
          onClick={() => props.selectMenu(slug.advance.configAqi)}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.configAQI}>
            <Link to={slug.advance.configAqi}>{MENU_NAME.config.configAQI}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  CẤU HÌNH TÍNH TOÁN WQI */}
      {protectRole(ROLE.CAU_HINH_TINH_TOAN_WQI.VIEW)(
        <Menu.Item
          key={slug.advance.configWqi}
          onClick={() => props.selectMenu(slug.advance.configWqi)}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.configWQI}>
            <Link to={slug.advance.configWqi}>{MENU_NAME.config.configWQI}</Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
