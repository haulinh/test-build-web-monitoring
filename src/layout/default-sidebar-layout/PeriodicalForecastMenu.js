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
      key={MENU_GROUP.PERIODICAL_FORECAST}
      title={
        <Tooltip
          placement="right"
          title={TOOLTIP_MENU.periodicalForecast.periodical}
        >
          <div style={CENTER}>
            <IconAntd
              type="fund"
              style={{
                fontSize: '20px',
                width: '22px',
                height: '22px',
                fontWeight: 'bold',
                marginLeft: '2px',
                marginRight: '0px',
              }}
            />
            <span style={{ marginLeft: 12 }}>
              {/* {MENU_NAME.processDataSub} */}
              {MENU_NAME.periodicalForecast.periodical}
              {/* {t('periodicalForecast.menu.periodical')} */}
            </span>
          </div>
        </Tooltip>
      }
    >
      {/* {protectRole(ROLE.QAQC.CONFIG_NEW)(

        )} */}
      {protectRole(ROLE.PERIODICAL_STATION.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.station}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.station)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.periodicalForecast.station}
          >
            <Link to={slug.periodicalForecast.station}>
              {MENU_NAME.periodicalForecast.station}
              {/* {t('periodicalForecast.menu.station')} */}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.PERIODICAL_IMPORT_DATA.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.importStation}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.importStation)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.periodicalForecast.import}
          >
            <Link to={slug.periodicalForecast.importStation}>
              {/* {MENU_NAME.processData.approveData} */}
              {MENU_NAME.periodicalForecast.import}

              {/* {t('periodicalForecast.title.importData')} */}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}

      {protectRole(ROLE.PERIODICAL_SEARCH_DATA.VIEW)(
        <Menu.Item
          key={slug.periodicalForecast.search}
          onClick={() => {
            props.selectMenu(slug.periodicalForecast.search)
          }}
        >
          <Tooltip
            placement="right"
            title={TOOLTIP_MENU.periodicalForecast.search}
          >
            <Link to={slug.periodicalForecast.search}>
              {/* {MENU_NAME.processData.approveData} */}
              {MENU_NAME.periodicalForecast.search}

              {t('periodicalForecast.title.search')}
            </Link>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu.SubMenu>
  ),
}
