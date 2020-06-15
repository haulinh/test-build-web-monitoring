import React from 'react'
import { Col, Menu, Affix, Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import queryString from 'query-string'
import styled from 'styled-components'

const Search = Input.Search

const i18n = {
  titleSubMenuAvgData: translate('avgSearchFrom.search.subMenuAvgData.title'),
  dataSearch: translate('avgSearchFrom.search.subMenuAvgData.dataSearch'),
  titleSubMenuFilters: translate('avgSearchFrom.search.subMenuFilters'),
}

const { SubMenu } = Menu

const SearchWrapper = styled.div`
  margin-left: 34px;
  margin-bottom: 10px;
`

const Title = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #3b3b3b;
  margin-bottom: 10px;
`

const MenuWrapper = styled(Col)`
  background-color: #f4f5f7;
  .ant-menu-submenu .ant-menu.ant-menu-sub {
    padding: 0px 0px !important;
  }
`

@connect(state => ({
  isOpenNavigation: state.theme.navigation.isOpen,
}))
@withRouter
@protectRole(ROLE.AVG_SEARCH.VIEW)
export default class FilterListMenu extends React.Component {
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
      <MenuWrapper span={4}>
        <Affix offsetTop={82}>
          <SearchWrapper>
            <Title>{i18n.titleSubMenuAvgData}</Title>
            <Search
              onChange={event => this.props.handleSearch(event.target.value)}
              placeholder="Enter Title"
              onSearch={this.props.handleSearch}
              style={{ width: 200, marginTop: '10px' }}
            />
          </SearchWrapper>
          <Menu
            style={{
              width: '65%',
              overflowX: 'hidden',
              overflowY: 'auto',
              backgroundColor: '#F4F5F7',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub2"
              title={
                <span style={{ marginLeft: 12, fontWeight: 600 }}>
                  {i18n.titleSubMenuFilters}
                </span>
              }
            >
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
      </MenuWrapper>
    )
  }
}
