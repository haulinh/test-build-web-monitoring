import React from 'react'
import { Col, Menu, Affix, Icon } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import queryString from 'query-string'

const i18n = {
  titleSubMenuAvgData: translate('avgSearchFrom.search.subMenuAvgData.title'),
  dataSearch: translate('avgSearchFrom.search.subMenuAvgData.dataSearch'),
  titleSubMenuFilters: translate('avgSearchFrom.search.subMenuFilters'),
}

const { SubMenu } = Menu

@connect(state => ({
  isOpenNavigation: state.theme.navigation.isOpen,
}))
@withRouter
@protectRole(ROLE.AVG_SEARCH.VIEW)
export default class FilterListMenu extends React.PureComponent {
  static propTypes = {
    configFilter: PropTypes.array,

    isOpenNavigation: PropTypes.bool,
  }

  handleClickFilterItem = filterId => () => {
    const filter = this.props.configFilter.find(
      filter => filter._id === filterId
    )
    const rawData = queryString.parse(filter.searchUrl, {
      encode: true,
      arrayFormat: 'bracket',
      skipNull: true,
      skipEmptyString: true,
    })

    rawData.searchNow = true
    this.props.history.push(
      slug.avgSearchAdvanced.base +
        '?formData=' +
        encodeURIComponent(JSON.stringify(rawData))
    )
  }

  render() {
    if (this.props.isOpenNavigation) return null
    return (
      <Col span={4}>
        <Affix offsetTop={82}>
          <Menu
            style={{
              width: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
              paddingTop: 16,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu key="sub1" title={i18n.titleSubMenuAvgData}>
              <Menu.Item key="1">
                <Icon type="search" />
                <span>{i18n.dataSearch}</span>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={i18n.titleSubMenuFilters}>
              {this.props.configFilter.map(filter => (
                <Menu.Item
                  onClick={this.handleClickFilterItem(filter._id)}
                  key={filter._id}
                >
                  {filter.name}
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        </Affix>
      </Col>
    )
  }
}
