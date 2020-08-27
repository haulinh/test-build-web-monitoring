import React from 'react'
import { Col, Menu, Input, Tooltip } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'

const MENU_WIDTH = 300

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

const MenuWrapper = styled(Col)`
  position: fixed;
  height: calc(100vh - 57px);
  width: ${MENU_WIDTH}px;
  border-left: 1px solid #f1f1f1;
  z-index: 1;
  /* padding: 0 16px; */
  overflow: auto;
  .ant-menu-item-group {
    .ant-menu-item-group-title {
      color: #333 !important;
      font-size: 15px !important;
      font-weight: 500 !important;
    }
    :not(:last-child) {
      margin-bottom: 8px;
    }
  }
  .ant-menu-submenu .ant-menu.ant-menu-sub {
    padding: 0px 0px !important;
  }
  .ant-menu-submenu-title {
    padding-left: 4px !important;
    color: #333 !important;
    font-weight: 500 !important;
    font-size: 16px !important;
  }
  .ant-menu.ant-menu-sub.ant-menu-inline {
    margin-left: 16px;
  }
`

@connect(state => ({
  isOpenNavigation: state.theme.navigation.isOpen,
  stations: _.get(state, 'stationAuto.list', []),
}))
@withRouter
@protectRole(ROLE.AVG_SEARCH.VIEW)
export default class FilterListMenu extends React.Component {
  static propTypes = {
    configFilter: PropTypes.array,
    filterId: PropTypes.string,

    stations: PropTypes.array,
    isOpenNavigation: PropTypes.bool,
  }

  static defaultProps = {
    configFilter: [],
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
    searchObj.filterId = filter._id

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

  getFilterGroupByStationType = () => {
    const filters = Array.isArray(this.props.configFilter)
      ? this.props.configFilter.map(filter => ({
          ...filter,
          stationType: JSON.parse(decodeURIComponent(filter.searchUrl))
            .stationType,
        }))
      : []
    return _.groupBy(filters, 'stationType')
  }

  getStationType = filterKey => {
    if (!this.props.stations.length) {
      return {
        name: '',
      }
    }
    const station = this.props.stations.find(
      station => station.stationType.key === filterKey
    )
    if (station) return station.stationType
    return {
      name: '',
    }
  }

  render() {
    const filters = this.getFilterGroupByStationType()
    // if (this.props.isOpenNavigation) return null
    return (
      <React.Fragment>
        <Col
          style={{
            width: MENU_WIDTH,
            backgroundColor: '#f4f5f7',
            minHeight: 'calc(100vh - 57px)',
          }}
        />
        <MenuWrapper>
          <SearchWrapper>
            <Tooltip
              title={translate('dataSearchFilterForm.tooltip.searchFilter')}
            >
              <Search
                onChange={event => this.handleOnChangeSearch(event)}
                placeholder={i18n.placeholderSearch}
                onSearch={this.props.handleSearch}
                style={{ width: '95%', marginTop: '10px' }}
              />
            </Tooltip>
          </SearchWrapper>
          {Object.keys(filters).length ? (
            <Menu
              style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                backgroundColor: '#F4F5F7',
              }}
              defaultSelectedKeys={[this.props.filterId]}
              defaultOpenKeys={[...Object.keys(filters), 'ALL']}
              mode="inline"
            >
              {Object.keys(filters)
                .sort()
                .map(filterKey => (
                  <SubMenu
                    key={filterKey || 'ALL'}
                    title={
                      this.getStationType(filterKey).name ||
                      translate('dataSearchFilterForm.table.all')
                    }
                  >
                    {filters[filterKey].map(filter => (
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
                ))}
            </Menu>
          ) : null}
        </MenuWrapper>
      </React.Fragment>
    )
  }
}