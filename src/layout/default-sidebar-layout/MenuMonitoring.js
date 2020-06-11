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
      key={MENU_GROUP.MONITORING}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.monitoringSub}>
          <div style={CENTER}>
            {Icon.screen}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.monitoringSub}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.MONITORING.VIEW)(
        <Menu.Item
          key={slug.monitoring.base}
          onClick={() => {
            props.selectMenu(slug.monitoring.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoring.base}>
            <Link to={slug.monitoring.base}>{MENU_NAME.monitoring.base}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.MONITORING_BY_LIST.VIEW)(
        <Menu.Item
          key={slug.monitoringList.base}
          onClick={() => {
            props.selectMenu(slug.monitoringList.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoringList.base}>
            <Link to={slug.monitoringList.base}>
              {MENU_NAME.monitoringList.base}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.MAP.VIEW)(
        <Menu.Item
          key={slug.map.base}
          onClick={() => {
            props.selectMenu(slug.map.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoring.map}>
            <Link to={slug.map.base}>{MENU_NAME.monitoring.map}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.CAMERA.VIEW)(
        <Menu.Item
          key={slug.cameraControl.base}
          onClick={() => {
            props.selectMenu(slug.cameraControl.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoring.camera}>
            <Link to={slug.cameraControl.base}>
              {MENU_NAME.monitoring.camera}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.DATA_SEARCH.VIEW)(
        <Menu.Item
          key={slug.dataSearch.base}
          onClick={() => {
            props.selectMenu(slug.dataSearch.base)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.monitoring.historyData}
          >
            <Link to={slug.dataSearch.base}>
              {MENU_NAME.monitoring.historyData}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.AVG_SEARCH.VIEW)(
        <Menu.Item
          key={slug.avgSearch.base}
          onClick={() => {
            props.selectMenu(slug.avgSearch.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.monitoring.avgData}>
            <Link to={slug.avgSearch.base}>{MENU_NAME.monitoring.avgData}</Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
