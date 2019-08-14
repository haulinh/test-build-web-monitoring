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

     
      {/* NOTE   Tỷ lệ số liệu thu được */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type10}
          onClick={() => {
            props.selectMenu(slug.report.type10)
          }}
        >
          <Link to={slug.report.type10}>{MENU_NAME.report.type10}</Link>
        </Menu.Item>
      )}

       {/* NOTE  LOAI 1 - Tỷ lệ số liệu */}
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

      {/* NOTE  LOAI 1 - trung binh theo giờ */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type11}
          onClick={() => {
            props.selectMenu(slug.report.type11)
          }}
        >
          <Link to={slug.report.type11}>{MENU_NAME.report.type11}</Link>
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

      {/* NOTE  LOAI 4 */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type4}
          onClick={() => {
            props.selectMenu(slug.report.type4)
          }}
        >
          <Link to={slug.report.type4}>{MENU_NAME.report.type4}</Link>
        </Menu.Item>
      )}

      {/* NOTE  LOAI 5 */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type5}
          onClick={() => {
            props.selectMenu(slug.report.type5)
          }}
        >
          <Link to={slug.report.type5}>{MENU_NAME.report.type5}</Link>
        </Menu.Item>
      )} */}

      {/* NOTE  LOAI 6 */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type6}
          onClick={() => {
            props.selectMenu(slug.report.type6)
          }}
        >
          <Link to={slug.report.type6}>{MENU_NAME.report.type6}</Link>
        </Menu.Item>
      )} */}

      {/* NOTE  LOAI 7 */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type7}
          onClick={() => {
            props.selectMenu(slug.report.type7)
          }}
        >
          <Link to={slug.report.type7}>{MENU_NAME.report.type7}</Link>
        </Menu.Item>
      )} */}

      {/* NOTE  LOAI 8 */}
      {/* {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type8}
          onClick={() => {
            props.selectMenu(slug.report.type8)
          }}
        >
          <Link to={slug.report.type8}>{MENU_NAME.report.type8}</Link>
        </Menu.Item>
      )} */}

      {/* NOTE  LOAI 9 - Ẩn vì @trường thấy giống loại 1 (Khí - Dữ liệu gốc)*/}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.report.type9}
          onClick={() => {
            props.selectMenu(slug.report.type9)
          }}
        >
          <Link to={slug.report.type9}>{MENU_NAME.report.type9}</Link>
        </Menu.Item>
      )}

      
    </Menu.SubMenu>
  )
}
