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
      key={MENU_GROUP.TICKET}
      title={
        <Tooltip placement="right" title={listTooltipMenu().ticket.incident}>
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
            <span style={{ marginLeft: 12 }}>{listMenuName().ticket}</span>
          </div>
        </Tooltip>
      }
    >
      {protectRole(ROLE.INCIDENT_MANAGEMENT.VIEW)(
        <Menu.Item
          key={slug.ticket.incident}
          onClick={() => {
            props.selectMenu(slug.ticket.incident)
          }}
        >
          <Tooltip placement="right" title={listTooltipMenu().ticket.incident}>
            <Link to={slug.ticket.incident}>{t('ticket.menu.incident')}</Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.INCIDENT_CONFIG_PROPERTIES.VIEW)(
        <Menu.Item
          key={slug.ticket.configProperties}
          onClick={() => {
            props.selectMenu(slug.ticket.configProperties)
          }}
        >
          <Tooltip
            placement="right"
            title={listTooltipMenu().ticket.configProperties}
          >
            <Link to={slug.ticket.configProperties}>
              {t('ticket.menu.configProperties')}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
