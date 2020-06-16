import React from 'react'
import { Spin, Row, Col } from 'antd'
import _ from 'lodash'
import StationList from './station-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './form/SearchForm'
import StationForm from './form/StationForm'
import DataStationAutoApi from 'api/DataStationAutoApi'
import OrganizationApi from 'api/OrganizationApi'
import { toggleNavigation } from 'redux/actions/themeAction'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { connectAutoDispatch } from 'redux/connect'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import { replaceVietnameseStr } from 'utils/string'
import Clearfix from 'components/elements/clearfix'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import FilterListMenu from './menu'

@connectAutoDispatch(
  state => ({
    values: _.get(state, 'form.dataSearchFilterForm.values', {}),
    organizationId: _.get(state, 'auth.userInfo.organization._id', 'vasoft'),
    isOpenNavigation: state.theme.navigation.isOpen,
    stations: _.get(state, 'stationAuto.list', []),
  }),
  { toggleNavigation }
)
@protectRole(ROLE.AVG_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
export default class AvgSearchAdvanced extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearchingData: false,
      isSearchingStation: false,
      stationKeys: props.stations.map(station => station.key),
      stationsData: this.getStationsData(props.stations),
      searchData: {},
      filteredConfigFilter: [],
      configFilter: [],
    }
  }

  componentDidMount() {
    this.getDataOrganization()
    this.props.toggleNavigation(false)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.stations.length !== prevProps.stations.length) {
      const stationKeys = this.props.stations.map(station => station.key)
      const stationsData = this.getStationsData(this.props.stations)
      this.setState({ stationKeys, stationsData })
    }
    if (!_.isEqual(this.props.values, prevProps.values)) {
      if (this.state.isSearchingData) this.setState({ isSearchingData: false })
    }
  }

  getDataOrganization = async () => {
    const organizationInfo = await OrganizationApi.getOrganization(
      this.props.organizationId
    )
    this.setState({
      configFilter: _.get(organizationInfo, ['data', 'configFilter']),
      filteredConfigFilter: _.get(organizationInfo, ['data', 'configFilter']),
    })
  }

  getStationsData = stations =>
    stations.map((station, index) => ({
      index,
      _id: station._id,
      key: station.key,
      name: station.name,
      view: true,
      measuringData: station.measuringList.sort(
        (a, b) => a.numericalOrder - b.numericalOrder
      ),
      measuringList: station.measuringList.map(measuring => measuring.key),
    }))

  handleChangeStationsData = stationsData => {
    this.setState({ stationsData })
  }

  handleSubmitSearch = params => {
    this.setState({ isSearchingData: true, searchData: params })
  }

  handleSaveInfoSearch = () => {
    console.log('save info')
  }

  handleOnSearchStationAuto = searchData => {
    this.setState({ isSearchingStation: true }, async () => {
      const { data: stationKeys } = await DataStationAutoApi.searchStationAuto(
        searchData
      )
      this.setState({ stationKeys, isSearchingStation: false })
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  handleSearch = searchText => {
    const { configFilter } = this.state
    const filteredConfigFilter = configFilter.filter(({ name }) => {
      name = replaceVietnameseStr(name)
      return name.includes(replaceVietnameseStr(searchText))
    })

    this.setState({
      filteredConfigFilter,
    })
  }

  render() {
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor="#fafbfb"
        right={null}
      >
        <Row
          style={{ marginLeft: '-24px', marginRight: '-24px' }}
          type="flex"
          gutter={[32, 0]}
        >
          <FilterListMenu
            configFilter={this.state.filteredConfigFilter}
            handleSearch={this.handleSearch}
          />
          <Col span={this.props.isOpenNavigation ? 24 : 19}>
            <Breadcrumb items={['list']} />
            <SearchFrom
              onSubmit={this.handleSubmitSearch}
              onSaveInfo={this.handleSaveInfoSearch}
              onSearchStationAuto={this.handleOnSearchStationAuto}
              initialValues={this.props.formData}
              searchNow={this.props.formData.searchNow}
            />
            <Clearfix height={16} />
            {!this.state.isSearchingData && (
              <Spin
                size="large"
                tip="Searching..."
                spinning={this.state.isSearchingStation}
              >
                <StationForm
                  onChangeStationsData={this.handleChangeStationsData}
                  stations={this.props.stations}
                  stationKeys={this.state.stationKeys}
                />
              </Spin>
            )}
            {this.state.isSearchingData && (
              <StationList
                // stationsData={this.state.stationsData}
                stationsData={this.state.stationsData}
                searchData={this.state.searchData}
                type={this.props.values.type}
              />
            )}
          </Col>
        </Row>
        {/* <FormFilter
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          onCreate={this.handleCreateFilter}
        /> */}
      </PageContainer>
    )
  }
}
