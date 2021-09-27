import { Menu, Tooltip, Icon as IconAntd } from 'antd'
import ROLE from 'constants/role'
import slug, { MENU_GROUP, listTooltipMenu, listMenuName } from 'constants/slug'
import protectRole from 'hoc/protect-role/forMenu'
import React from 'react'
import { Link } from 'react-router-dom'
import { translate as t } from 'hoc/create-lang'

const CENTER = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
}

export default {
  renderComp: props => (
    <Menu.SubMenu
      key={MENU_GROUP.BILLING}
      title={
        <Tooltip
          placement="right"
          title={listTooltipMenu().periodicalForecast.periodical}
        >
          <div style={CENTER}>
            <IconAntd
              type="dollar"
              style={{
                fontSize: '20px',
                width: '22px',
                height: '22px',
                fontWeight: 'bold',
                marginLeft: '2px',
                marginRight: '0px',
              }}
            />
            <span style={{ marginLeft: 12 }}>{listMenuName().billing}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.BILLING_REPORT.VIEW)(
        <Menu.Item
          key={slug.billing.report}
          onClick={() => {
            props.selectMenu(slug.billing.report)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().periodicalForecast.station}
          >
            <Link to={slug.billing.report}>
              {t('billing.menu.billingReport')}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.BILLING_CONFIG.VIEW)(
        <Menu.Item
          key={slug.billing.config}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.importStation)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().periodicalForecast.import}
          >
            <Link to={slug.billing.config}>
              {t('billing.menu.billingConfig')}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
