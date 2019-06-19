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
      key={MENU_GROUP.CONFIG}
      title={
        <div style={CENTER}>
          {Icon.config}
          <span style={{ marginLeft: 12 }}>{MENU_NAME.configSub}</span>
        </div>
      }
    >
      {/* NOTE  TRẠM QUAN TRẮC */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationAuto.base}
          onClick={() => {
            props.selectMenu(slug.stationAuto.base)
          }}
        >
          <Link to={slug.stationAuto.base}>{MENU_NAME.config.stationAuto}</Link>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH KẾT NỐI */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configConnection.base}
          onClick={() => props.selectMenu(slug.stationAuto.configConnection.base)}
        >
          <Link to={slug.stationAuto.configConnection.base}>{MENU_NAME.config.stationAutoConnection}</Link>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH GỞI CẢNH BÁO */}
      {protectRole(ROLE.STATION_AUTO.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configConnection.base}
          onClick={() => props.selectMenu(slug.stationAuto.configSendNotification.base)}
        >
          <Link to={slug.stationAuto.configSendNotification.base}>{MENU_NAME.config.sendNotification}</Link>
        </Menu.Item>
      )}

      {/* NOTE  CHỈ TIÊU QUAN TRẮC */}
      {protectRole(ROLE.MEASURING.VIEW)(
        <Menu.Item
          key={slug.measuring.base}
          onClick={() => {
            props.selectMenu(slug.measuring.base)
          }}
        >
          <Link to={slug.measuring.base}>{MENU_NAME.config.parameter}</Link>
        </Menu.Item>
      )}

      {/* NOTE  LOẠI TRẠM */}
      {protectRole(ROLE.STATION_TYPE.VIEW)(
        <Menu.Item
          key={slug.stationType.base}
          onClick={() => {
            props.selectMenu(slug.stationType.base)
          }}
        >
          <Link to={slug.stationType.base}>{MENU_NAME.config.stationType}</Link>
        </Menu.Item>
      )}

      {/*  */}
      {protectRole(ROLE.PROVINCE.VIEW)(
        <Menu.Item
          key={slug.province.base}
          onClick={() => {
            props.selectMenu(slug.province.base)
          }}
        >
          <Link to={slug.province.base}>{MENU_NAME.config.site}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.QCVN.VIEW)(
        <Menu.Item
          key={slug.qcvn.base}
          onClick={() => {
            props.selectMenu(slug.qcvn.base)
          }}
        >
          <Link to={slug.qcvn.base}>{MENU_NAME.config.standard}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.ROLE.VIEW)(
        <Menu.Item
          key="/role"
          // key={slug.role.base}
          onClick={() => {
            props.selectMenu(slug.role.base)
          }}
        >
          <Link to={slug.role.base}>{MENU_NAME.config.role}</Link>
        </Menu.Item>
      )}

      {protectRole(ROLE.USER.VIEW)(
        <Menu.Item
          key={slug.user.base}
          onClick={() => {
            props.selectMenu(slug.user.base)
          }}
        >
          <Link to={slug.user.base}>{MENU_NAME.config.user}</Link>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  )
}
