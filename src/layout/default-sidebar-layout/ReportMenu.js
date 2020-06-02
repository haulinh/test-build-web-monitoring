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
  fontWeight: 600,
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
      {protectRole(ROLE.TILE_DULIEU_THUDUOC.VIEW)(
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
      {/* {protectRole(ROLE.TILE_DULIEU.VIEW)(
        <Menu.Item
          key={slug.report.type1}
          onClick={() => {
            props.selectMenu(slug.report.type1)
          }}
        >
          <Link to={slug.report.type1}>{MENU_NAME.report.type1}</Link>
        </Menu.Item>
      )} */}
      {/* NOTE  LOAI 2 */}
      {protectRole(ROLE.TB24H.VIEW)(
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
      {protectRole(ROLE.TB1H.VIEW)(
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
      {protectRole(ROLE.TB1MAX.VIEW)(
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
      {protectRole(ROLE.TB8MAX.VIEW)(
        <Menu.Item
          key={slug.report.type4}
          onClick={() => {
            props.selectMenu(slug.report.type4)
          }}
        >
          <Link to={slug.report.type4}>{MENU_NAME.report.type4}</Link>
        </Menu.Item>
      )}
      {protectRole(ROLE.TILE_DULIE_VUOTNGUONG.VIEW)(
        <Menu.Item
          key={slug.report.type12}
          onClick={() => {
            props.selectMenu(slug.report.type12)
          }}
        >
          <Link to={slug.report.type12}>{MENU_NAME.report.type12}</Link>
        </Menu.Item>
      )}

      {/* // NOTE Báo cáo AQI - START */}
      {protectRole(ROLE.AQI_GIO.VIEW)(
        <Menu.Item
          key={slug.report.aqi_hour}
          onClick={() => {
            props.selectMenu(slug.report.aqi_hour)
          }}
        >
          <Link to={slug.report.aqi_hour}>{MENU_NAME.report.aqi_hour}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.AQI_NGAY.VIEW)(
        <Menu.Item
          key={slug.report.aqi_day}
          onClick={() => {
            props.selectMenu(slug.report.aqi_day)
          }}
        >
          <Link to={slug.report.aqi_day}>{MENU_NAME.report.aqi_day}</Link>
        </Menu.Item>
      )}
      {/* // NOTE Báo cáo AQI - END */}

      {protectRole(ROLE.TINH_TRANG_DU_LIEU.VIEW)(
        <Menu.Item
          key={slug.report.status_data}
          onClick={() => {
            props.selectMenu(slug.report.status_data)
          }}
        >
          <Link to={slug.report.status_data}>
            {MENU_NAME.report.status_data}
          </Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
