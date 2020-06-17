import React from 'react'
import { Col, Menu, Affix, Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'

const Search = Input.Search

const i18n = {
  titleSubMenuAvgData: translate('avgSearchFrom.search.subMenuAvgData.title'),
  dataSearch: translate('avgSearchFrom.search.subMenuAvgData.dataSearch'),
  titleSubMenuFilters: translate('avgSearchFrom.search.subMenuFilters'),
  placeholderSearch: translate(
    'avgSearchFrom.search.subMenuAvgData.placeholderSearch'
  ),
}

const { SubMenu } = Menu

const SearchWrapper = styled.div`
  margin-left: 16px;
  margin-bottom: 8px;
`

const Title = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #3b3b3b;
`

const MenuWrapper = styled(Col)`
  background-color: #f4f5f7;
  min-height: calc(100vh - 57px);
  .ant-menu-submenu .ant-menu.ant-menu-sub {
    padding: 0px 0px !important;
  }
  .ant-menu-submenu-title {
    padding-left: 4px !important;
  }
  .ant-menu.ant-menu-sub.ant-menu-inline {
    margin-left: 16px;
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

  state = {
    highlightText: '',
  }

  handleClickFilterItem = filterId => () => {
    const filter = this.props.configFilter.find(
      filter => filter._id === filterId
    )

    const searchObj = JSON.parse(decodeURIComponent(filter.searchUrl))
    searchObj.searchNow = true

    this.props.history.push(
      slug.avgSearchAdvanced.base +
        '?formData=' +
        encodeURIComponent(JSON.stringify(searchObj))
    )
  }

  handleOnChangeSearch = event => {
    this.setState({ highlightText: event.target.value })
    this.props.handleSearch(event.target.value)
  }

  getHighlightedText(text, highlightText) {
    //Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlightText})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => {
          return (
            <span
              key={i}
              style={
                part.toLowerCase() === highlightText.toLowerCase()
                  ? { backgroundColor: 'yellow' }
                  : {}
              }
            >
              {part}
            </span>
          )
        })}
      </span>
    )
  }

  render() {
    if (this.props.isOpenNavigation) return null
    return (
      <MenuWrapper span={5}>
        <Affix offsetTop={57}>
          <SearchWrapper>
            <Search
              onChange={event => this.handleOnChangeSearch(event)}
              placeholder={i18n.placeholderSearch}
              onSearch={this.props.handleSearch}
              style={{ width: '95%', marginTop: '10px' }}
            />
          </SearchWrapper>
          <Menu
            style={{
              overflowX: 'hidden',
              overflowY: 'auto',
              backgroundColor: '#F4F5F7',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
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
                  {this.getHighlightedText(
                    filter.name,
                    this.state.highlightText
                  )}
                </Menu.Item>
              ))}
            </SubMenu>
          </Menu>
        </Affix>
      </MenuWrapper>
    )
  }
}
