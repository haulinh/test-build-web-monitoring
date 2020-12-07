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
      key={MENU_GROUP.STATIONFIXED}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.stationFixedSub}>
          <div style={CENTER}>
            {Icon.stationFixed}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.stationFixedSub}</span>
          </div>
        </Tooltip>
      }
    >
      {/* NOTE  ĐỢT QUAN TRẮC */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationFixedPhase.base}
          onClick={() => {
            props.selectMenu(slug.stationFixedPhase.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.stationFixed.base}>
            <Link to={slug.stationFixedPhase.base}>
              {MENU_NAME.stationFixed.base}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
 
      {/* NOTE  quản lý điểm quan trắc */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationFixed.base}
          onClick={() => {
            props.selectMenu(slug.stationFixed.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.stationFixed.base}>
            <Link to={slug.stationFixed.base}>
              {MENU_NAME.stationFixed.point}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  nhập dữ liệu quan trắc */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationFixed.base}
          onClick={() => {
            props.selectMenu(slug.stationFixed.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.stationFixed.base}>
            <Link to={slug.stationFixedPhase.base}>
              {MENU_NAME.stationFixed.inputData}
            </Link>
          </Tooltip>
        </Menu.Item>
      )} */}

      {/* NOTE  tra cứu dữ liệu */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationFixedReport.base}
          onClick={() => {
            props.selectMenu(slug.stationFixedReport.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.stationFixed.base}>
            <Link to={slug.stationFixedReport.base}>
              {MENU_NAME.stationFixed.report}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  bản đồ */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationFixed.base}
          onClick={() => {
            props.selectMenu(slug.stationFixed.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.stationFixed.base}>
            <Link to={slug.stationFixedPhase.base}>
              {MENU_NAME.stationFixed.map}
            </Link>
          </Tooltip>
        </Menu.Item>
      )} */}
    </Menu.SubMenu>
  ),
}
