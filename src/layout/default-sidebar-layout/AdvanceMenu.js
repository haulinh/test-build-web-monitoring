// import PropTypes from 'prop-types'
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
      key={MENU_GROUP.ADVANCE}
      title={
        <Tooltip placement="right" title={listTooltipMenu().advanceSub}>
          <div style={CENTER}>
            {Icon.advance}
            <span style={{ marginLeft: 12 }}>{listMenuName().advanceSub}</span>
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
          <Tooltip
            placement="right"
            title={listTooltipMenu().monitoring.mapAQI}
          >
            <Link to={slug.advance.mapAqi}>
              {listMenuName().monitoring.mapAQI}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().report.aqi_hour}>
            <Link to={slug.advance.aqi_hour}>
              {listMenuName().report.aqi_hour}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().report.aqi_day}>
            <Link to={slug.advance.aqi_day}>
              {listMenuName().report.aqi_day}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().advance.wqiMap}>
            <Link to={slug.advance.mapWqi}>
              {listMenuName().advance.wqiMap}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().advance.wqiHour}>
            <Link to={slug.advance.wqi_hour}>
              {listMenuName().advance.wqiHour}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().advance.wqiDay}>
            <Link to={slug.advance.wqi_day}>
              {listMenuName().advance.wqiDay}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.WQI_PERIODIC.VIEW)(
        <Menu.Item
          key={slug.advance.wqi_periodic}
          onClick={() => {
            props.selectMenu(slug.advance.wqi_periodic)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().advance.wqiPeriodic}
          >
            <Link to={slug.advance.wqi_periodic}>
              {listMenuName().advance.wqiPeriodic}
            </Link>
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
          <Tooltip placement="right" title={listTooltipMenu().advance.config}>
            <Link to={slug.advance.enableAqiWqi}>
              {listMenuName().advance.config}
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
          <Tooltip placement="right" title={listTooltipMenu().config.configAQI}>
            <Link to={slug.advance.configAqi}>
              {listMenuName().config.configAQI}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  CẤU HÌNH TÍNH TOÁN WQI */}
      {protectRole(ROLE.CAU_HINH_TINH_TOAN_WQI.VIEW)(
        <Menu.Item
          key={slug.advance.configWqi}
          onClick={() => props.selectMenu(slug.advance.configWqi)}
        >
          <Tooltip placement="right" title={listTooltipMenu().config.configWQI}>
            <Link to={slug.advance.configWqi}>
              {listMenuName().config.configWQI}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
