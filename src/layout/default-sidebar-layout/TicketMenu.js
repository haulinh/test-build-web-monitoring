import { Menu, Tooltip, Icon as IconAntd } from 'antd'
import ROLE from 'constants/role'
import slug, { MENU_GROUP, TOOLTIP_MENU, MENU_NAME } from 'constants/slug'
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
      key={MENU_GROUP.TICKET}
      title={
        <Tooltip placement="right" title={TOOLTIP_MENU.ticket.incident}>
          <div style={CENTER}>
            <IconAntd
              type="form"
              style={{
                fontSize: '20px',
                width: '22px',
                height: '22px',
                fontWeight: 'bold',
                marginLeft: '2px',
                marginRight: '0px',
              }}
            />
            <span style={{ marginLeft: 12 }}>{MENU_NAME.ticket}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.BILLING_REPORT.VIEW)(
        <Menu.Item
          key={slug.ticket.incident}
          onClick={() => {
            props.selectMenu(slug.ticket.incident)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.ticket.incident}>
            <Link to={slug.ticket.incident}>{t('ticket.menu.incident')}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.BILLING_CONFIG.VIEW)(
        <Menu.Item
          key={slug.ticket.dataLookup}
          onClick={() => {
            props.selectMenu(slug.ticket.dataLookup)
          }}
        >
          <Tooltip placement="right" title={TOOLTIP_MENU.ticket.dataLookup}>
            <Link to={slug.ticket.dataLookup}>
              {t('ticket.menu.dataLookup')}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      <Menu.Item
        key={slug.ticket.configProperties}
        onClick={() => {
          props.selectMenu(slug.ticket.configProperties)
        }}
      >
        <Tooltip placement="right" title={TOOLTIP_MENU.ticket.configProperties}>
          <Link to={slug.ticket.configProperties}>
            {t('ticket.menu.configProperties')}
          </Link>
        </Tooltip>
      </Menu.Item>
    </Menu.SubMenu>
  ),
}
