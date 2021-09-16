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
      key={MENU_GROUP.HANDLE_DATA}
      title={
        <Tooltip placement="right" title={listTooltipMenu().processDataSub}>
          <div style={CENTER}>
            {Icon.handleData}
            <span style={{ marginLeft: 12 }}>
              {listMenuName().processDataSub}
            </span>
          </div>
        </Tooltip>
      }
    >
      {/* {protectRole(ROLE.QAQC.CONFIG_NEW)(

        )} */}
      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.VIEW)(
        <Menu.Item
          key={slug.qaqc.configNew}
          onClick={() => {
            props.selectMenu(slug.qaqc.configNew)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().processData.configNew}
          >
            <Link to={slug.qaqc.configNew}>
              {listMenuName().processData.configNew}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW)(
        <Menu.Item
          key={slug.qaqc.base}
          onClick={() => {
            props.selectMenu(slug.qaqc.base)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().processData.approveData}
          >
            <Link to={slug.qaqc.base}>
              {listMenuName().processData.approveData}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
