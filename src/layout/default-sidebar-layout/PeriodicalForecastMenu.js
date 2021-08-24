import { Menu, Tooltip } from 'antd'
import ROLE from 'constants/role'
import slug, { MENU_GROUP, TOOLTIP_MENU } from 'constants/slug'
import protectRole from 'hoc/protect-role/forMenu'
import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'themes/icon'

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.PERIODICAL_FORECAST}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.processDataSub}>
          <div style={CENTER}>
            {Icon.handleData}
            <span style={{ marginLeft: 12 }}>
              {/* {MENU_NAME.processDataSub} */}
              Dự báo định kỳ
            </span>
          </div>
        </Tooltip>
      }
    >
      {/* {protectRole(ROLE.QAQC.CONFIG_NEW)(

        )} */}
      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU_CONFIG.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.station}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.station)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.processData.configNew}>
            <Link to={slug.periodicalForecast.station}>
              {/* {MENU_NAME.processData.configNew} */}
              Trạm quan trắc
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.importStation}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.importStation)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.processData.approveData}
          >
            <Link to={slug.periodicalForecast.importStation}>
              {/* {MENU_NAME.processData.approveData} */}
              Nhập dữ liệu
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.XU_LY_KIEM_DUYET_DU_LIEU.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.search}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.search)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.processData.approveData}
          >
            <Link to={slug.periodicalForecast.search}>
              {/* {MENU_NAME.processData.approveData} */}
              Tra cứu dữ liệu
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
