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
  fontWeight: 600
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.MONITORING}
      title={
        <div style={CENTER}>
          {Icon.screen}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.monitoringSub}</span>
        </div>
      }
    >
      {protectRole(ROLE.MONITORING.VIEW)(
        <Menu.Item
          key={slug.monitoring.base}
          onClick={() => {
            props.selectMenu(slug.monitoring.base)
          }}
        >
          <Link to={slug.monitoring.base}>{MENU_NAME.monitoring.base}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.MAP.VIEW)(
        <Menu.Item
          key={slug.map.base}
          onClick={() => {
            props.selectMenu(slug.map.base);
          }}
        >
          <Link to={slug.map.base}>{MENU_NAME.monitoring.map}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.CAMERA.VIEW)(
        <Menu.Item
          key={slug.cameraControl.base}
          onClick={() => {
            props.selectMenu(slug.cameraControl.base)
          }}
        >
          <Link to={slug.cameraControl.base}>
            {MENU_NAME.monitoring.camera}
          </Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.DATA_SEARCH.VIEW)(
        <Menu.Item
          key={slug.dataSearch.base}
          onClick={() => {
            props.selectMenu(slug.dataSearch.base);
          }}
        >
          <Link to={slug.dataSearch.base}>
            {MENU_NAME.monitoring.historyData}
          </Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.AVG_SEARCH.VIEW)(
        <Menu.Item
          key={slug.avgSearch.base}
          onClick={() => {
            props.selectMenu(slug.avgSearch.base);
          }}
        >
          <Link to={slug.avgSearch.base}>{MENU_NAME.monitoring.avgData}</Link>
        </Menu.Item>
      )}

    </Menu.SubMenu>
  )
}
