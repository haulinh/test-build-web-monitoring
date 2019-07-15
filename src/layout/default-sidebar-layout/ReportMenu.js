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
      key={MENU_GROUP.REPORT}
      title={
        <div style={CENTER}>
          {Icon.config}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.reportSub}</span>
        </div>
      }
    >

      {/* NOTE  LOAI 1 - Tỷ lệ số liệu thu được */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type1}
          onClick={() => {
            props.selectMenu(slug.report.type1)
          }}
        >
          <Link to={slug.report.type1}>{MENU_NAME.report.type1}</Link>
        </Menu.Item>
      )}

      {/* NOTE  LOAI 2 */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type2}
          onClick={() => {
            props.selectMenu(slug.report.type2)
          }}
        >
          <Link to={slug.report.type2}>{MENU_NAME.report.type2}</Link>
        </Menu.Item>
      )}

      {/* NOTE  LOAI 3 */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type3}
          onClick={() => {
            props.selectMenu(slug.report.type3)
          }}
        >
          <Link to={slug.report.type3}>{MENU_NAME.report.type3}</Link>
        </Menu.Item>
      )}

      
    </Menu.SubMenu>
  )
}
