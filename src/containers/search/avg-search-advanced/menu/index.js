import React from 'react'
import { Col, Menu, Input, Tooltip, Icon, Popconfirm } from 'antd'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import slug from 'constants/slug'
import { translate } from 'hoc/create-lang'
import styled from 'styled-components'
import CategoryApi from 'api/CategoryApi'

const MENU_WIDTH = 300

const Search = Input.Search

function i18n() {
  return {
    titleSubMenuAvgData: translate('avgSearchFrom.search.subMenuAvgData.title'),
    dataSearch: translate('avgSearchFrom.search.subMenuAvgData.dataSearch'),
    titleSubMenuFilters: translate('avgSearchFrom.search.subMenuFilters'),
    placeholderSearch: translate(
      'avgSearchFrom.search.subMenuAvgData.placeholderSearch'
    ),
  }
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

const Flex = styled(Menu.Item)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  :hover {
    .icon-delete {
      display: block;
    }
  }
  .icon-delete {
    display: none;
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

  constructor(props) {
    super(props)
    this.state = {
      highlightText: '',
      stationTypes: new Map(),
    }
  }

  async componentDidMount() {
    const results = await CategoryApi.getStationTypes({}, { isAuto: true })
    if (results.success)
      this.setState({
        stationTypes: new Map(
          results.data.map(stationType => [stationType.key, stationType])
        ),
      })
  }

  getHighlightedText = (text, highlightText) => {
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
      return ''
    }
    const station = this.state.stationTypes.get(filterKey)
    if (station) return station.name
    return ''
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
                placeholder={i18n().placeholderSearch}
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
                      this.getStationType(filterKey) ||
                      translate('dataSearchFilterForm.table.all')
                    }
                  >
                    {filters[filterKey].map(filter => (
                      <Flex
                        onClick={this.handleClickFilterItem(filter._id)}
                        key={filter._id}
                      >
                        <div>
                          {this.getHighlightedText(
                            filter.name,
                            this.state.highlightText
                          )}
                        </div>
                        <Popconfirm
                          title={translate(
                            'avgSearchFrom.search.subMenuAvgData.confirm.title'
                          )}
                          onConfirm={event => {
                            event.stopPropagation()
                            this.props.handleDeleteFilter(filter._id)
                            this.props.history.push('/avg-search-advanced')
                          }}
                          onCancel={event => event.stopPropagation()}
                          okText={translate(
                            'avgSearchFrom.search.subMenuAvgData.confirm.yes'
                          )}
                          cancelText={translate(
                            'avgSearchFrom.search.subMenuAvgData.confirm.no'
                          )}
                        >
                          <Icon
                            onClick={event => event.stopPropagation()}
                            className="icon-delete"
                            type="close-circle"
                            theme="filled"
                            style={{
                              fontSize: '14px',
                            }}
                          />
                        </Popconfirm>
                      </Flex>
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
