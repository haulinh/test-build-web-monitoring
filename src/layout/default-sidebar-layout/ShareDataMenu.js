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
      key={MENU_GROUP.SHARE_DATA}
      title={
        <div style={CENTER}>
          {Icon.configWQI}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.shareDataSub}</span>
        </div>
      }
    >
      {protectRole(ROLE.QAQCCONFIG.VIEW)(
        <Menu.Item
          key={slug.qaqc.config}
          onClick={() => {
            props.selectMenu(slug.qaqc.config)
          }}
        >
          <Link to={slug.qaqc.config}>{MENU_NAME.shareData.shareConfig}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.FTPTRANSFER.VIEW)(
        <Menu.Item
          key={slug.ftpTransfer.base}
          onClick={() => {
            props.selectMenu(slug.ftpTransfer.base)
          }}
        >
          <Link to={slug.ftpTransfer.base}>
            {MENU_NAME.shareData.ftpConfig}
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  )
}
