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
      key={MENU_GROUP.STATIONFIXED}
      title={
        <Tooltip placement="right" title={listTooltipMenu().stationFixedSub}>
          <div style={CENTER}>
            {Icon.stationFixed}
            <span style={{ marginLeft: 12 }}>
              {listMenuName().stationFixedSub}
            </span>
          </div>
        </Tooltip>
      }
    >
      {/* NOTE  ĐỢT QUAN TRẮC */}
      {protectRole(ROLE.STATION_FIXED_PHASE.VIEW)(
        <Menu.Item
          key={slug.stationFixedPhase.base}
          onClick={() => {
            props.selectMenu(slug.stationFixedPhase.base)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().stationFixed.base}
          >
            <Link to={slug.stationFixedPhase.base}>
              {listMenuName().stationFixed.base}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  quản lý điểm quan trắc */}
      {protectRole(ROLE.STATION_FIXED.VIEW)(
        <Menu.Item
          key={slug.stationFixed.base}
          onClick={() => {
            props.selectMenu(slug.stationFixed.base)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().stationFixed.point}
          >
            <Link to={slug.stationFixed.base}>
              {listMenuName().stationFixed.point}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  nhập dữ liệu quan trắc */}
      {protectRole(ROLE.STATION_FIXED_INPUT.VIEW)(
        <Menu.Item
          key={slug.stationFixed.importData}
          onClick={() => {
            props.selectMenu(slug.stationFixed.importData)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().stationFixed.importData}
          >
            <Link to={slug.stationFixed.importData}>
              {listMenuName().stationFixed.importData}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  tra cứu dữ liệu */}
      {protectRole(ROLE.STATION_FIXED_SEARCH.VIEW)(
        <Menu.Item
          key={slug.stationFixedReport.base}
          onClick={() => {
            props.selectMenu(slug.stationFixedReport.base)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().stationFixed.report}
          >
            <Link to={slug.stationFixedReport.base}>
              {listMenuName().stationFixed.report}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  bản đồ */}
      {protectRole(ROLE.MAP_STATION_FIXED.VIEW)(
        <Menu.Item
          key={slug.stationFixed.map}
          onClick={() => {
            props.selectMenu(slug.stationFixed.map)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().stationFixed.map}>
            <Link to={slug.stationFixed.map}>
              {listMenuName().stationFixed.map}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
