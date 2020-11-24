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
      key={MENU_GROUP.CONFIG}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.configSub}>
          <div style={CENTER}>
            {Icon.config}
            <span style={{ marginLeft: 12 }}>{MENU_NAME.configSub}</span>
          </div>
        </Tooltip>
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
          <Tooltip placement="right" title={TOOLTIP_MENU.config.stationAuto}>
            <Link to={slug.stationAuto.base}>
              {MENU_NAME.config.stationAuto}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH KẾT NỐI */}
      {protectRole(ROLE.CAU_HINH_KET_NOI.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configConnection.base}
          onClick={() =>
            props.selectMenu(slug.stationAuto.configConnection.base)
          }
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.config.stationAutoConnection}
          >
            <Link to={slug.stationAuto.configConnection.base}>
              {MENU_NAME.config.stationAutoConnection}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH LẤY MẪU */}
      {protectRole(ROLE.CAU_HINH_LAY_MAU.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configSampling.base}
          onClick={() => props.selectMenu(slug.stationAuto.configSampling.base)}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.sampling}>
            <Link to={slug.stationAuto.configSampling.base}>
              {MENU_NAME.config.sampling}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH CAMERA */}
      {protectRole(ROLE.CAU_HINH_CAMERA.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configCamera.base}
          onClick={() => props.selectMenu(slug.stationAuto.configCamera.base)}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.camera}>
            <Link to={slug.stationAuto.configCamera.base}>
              {MENU_NAME.config.camera}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE   CẤU HÌNH GỞI CẢNH BÁO */}
      {protectRole(ROLE.CAU_HINH_GUI_CANH_BAO.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configSendNotification.base}
          onClick={() =>
            props.selectMenu(slug.stationAuto.configSendNotification.base)
          }
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.config.sendNotification}
          >
            <Link to={slug.stationAuto.configSendNotification.base}>
              {MENU_NAME.config.sendNotification}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  CẤU HÌNH MÀU SẮC */}
      {protectRole(ROLE.CONFIG_COLOR_NOTI.VIEW)(
        <Menu.Item
          key={slug.stationAuto.configColor.base}
          onClick={() => props.selectMenu(slug.stationAuto.configColor.base)}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.color}>
            <Link to={slug.stationAuto.configColor.base}>
              {MENU_NAME.config.color}
            </Link>
          </Tooltip>
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
          <Tooltip placement="right" title={TOOLTIP_MENU.config.parameter}>
            <Link to={slug.measuring.base}>{MENU_NAME.config.parameter}</Link>
          </Tooltip>
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
          <Tooltip placement="right" title={TOOLTIP_MENU.config.stationType}>
            <Link to={slug.stationType.base}>
              {MENU_NAME.config.stationType}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  ĐƠN VỊ QUẢN LÝ */}
      {protectRole(ROLE.PROVINCE.VIEW)(
        <Menu.Item
          key={slug.province.base}
          onClick={() => {
            props.selectMenu(slug.province.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.site}>
            <Link to={slug.province.base}>{MENU_NAME.config.site}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  QUY CHUẨN */}
      {protectRole(ROLE.QCVN.VIEW)(
        <Menu.Item
          key={slug.qcvn.base}
          onClick={() => {
            props.selectMenu(slug.qcvn.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.standard}>
            <Link to={slug.qcvn.base}>{MENU_NAME.config.standard}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  NHÓM QUYỀN */}
      {protectRole(ROLE.ROLE.VIEW)(
        <Menu.Item
          key={slug.config.service}
          // key={slug.role.base}
          onClick={() => {
            props.selectMenu(slug.config.service)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.role}>
            <Link to={slug.config.service}>Cấu hình dịch vụ</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  NHÓM QUYỀN */}
      {protectRole(ROLE.ROLE.VIEW)(
        <Menu.Item
          key="/role"
          // key={slug.role.base}
          onClick={() => {
            props.selectMenu(slug.role.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.role}>
            <Link to={slug.role.base}>{MENU_NAME.config.role}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  TÀI KHOẢN */}
      {protectRole(ROLE.USER.VIEW)(
        <Menu.Item
          key={slug.user.base}
          onClick={() => {
            props.selectMenu(slug.user.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.user}>
            <Link to={slug.user.base}>{MENU_NAME.config.user}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {/* NOTE  NHẬT KÝ */}
      {protectRole(ROLE.XEM_NHAT_KY.VIEW)(
        <Menu.Item
          key={slug.dataLogger.base}
          onClick={() => {
            props.selectMenu(slug.dataLogger.base)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.config.dataLogger}>
            <Link to={slug.dataLogger.base}>{MENU_NAME.config.dataLogger}</Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
