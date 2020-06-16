import React from 'react'
import { Spin } from 'antd'
import _ from 'lodash'
import StationList from './station-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './form/SearchForm'
import StationForm from './form/StationForm'
import DataStationAutoApi from 'api/DataStationAutoApi'
import { toggleNavigation } from 'redux/actions/themeAction'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { connectAutoDispatch } from 'redux/connect'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'

@connectAutoDispatch(
  state => ({
    values: _.get(state, 'form.dataSearchFilterForm.values', {}),
    organizationId: _.get(state, 'auth.userInfo.organization._id', 'vasoft'),
    configFilter: _.get(state, 'auth.userInfo.organization.configFilter', []),
    isOpenNavigation: state.theme.navigation.isOpen,
    stations: _.get(state, 'stationAuto.list', []),
  }),
  { toggleNavigation }
)
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
    }
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
  render() {
    return (
      <PageContainer
        {...this.props.wrapperProps}
        backgroundColor="#fafbfb"
        right={null}
      >
        <Breadcrumb items={['list']} />
        <SearchFrom
          onSubmit={this.handleSubmitSearch}
          onSaveInfo={this.handleSaveInfoSearch}
          onSearchStationAuto={this.handleOnSearchStationAuto}
          initialValues={this.props.formData}
          searchNow={this.props.formData.searchNow}
        />
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
            // isLoading={this.state.isLoading}
            stationsData={this.state.stationsData}
            searchData={this.state.searchData}
            type={this.props.values.type}

            // measuringData={this.state.measuringData}
            // measuringList={this.state.measuringList}
            // dataStationAuto={this.state.dataStationAuto}
            // pagination={this.state.pagination}
            // onChangePage={this.handleChangePage}
            // onExportExcel={this.handleExportExcel}
            // nameChart={this.state.searchFormData.name}
            // typeReport={`${this.state.searchFormData.type}`}
            // isExporting={this.state.isExporting}
            // stations={this.props.stations}
            // stationKeys={this.state.stationKeys}
          />
        )}
      </PageContainer>
    )
  }
}
