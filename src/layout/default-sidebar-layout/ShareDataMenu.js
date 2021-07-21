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
      key={MENU_GROUP.SHARE_DATA}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.shareDataSub}>
          <div style={CENTER}>
            {Icon.configWQI}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.shareDataSub}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.QAQCCONFIG.VIEW)(
        <Menu.Item
          key={slug.qaqc.config}
          onClick={() => {
            props.selectMenu(slug.qaqc.config)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.shareData.shareConfig}>
            <Link to={slug.qaqc.config}>{MENU_NAME.shareData.shareConfig}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.FTPTRANSFER.VIEW)(
        <Menu.Item
          key={slug.ftpTransfer.base}
          onClick={() => {
            props.selectMenu(slug.ftpTransfer.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.shareData.ftpConfig}>
            <Link to={slug.ftpTransfer.base}>
              {MENU_NAME.shareData.ftpConfig}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.SHARE_API.VIEW)(
        <Menu.Item
          key={slug.apiSharing.base}
          onClick={() => {
            props.selectMenu(slug.apiSharing.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.shareData.apiSharing}>
            <Link to={slug.apiSharing.base}>
              {MENU_NAME.shareData.apiSharing}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
