import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import wqiApi from 'api/WqiApi'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import * as _ from 'lodash'
import { message, Spin, Typography } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import { getListConfigWqi } from 'api/CategoryApi'
import ReferencesComponent from 'components/elements/references'
import slug from 'constants/slug'
import moment from 'moment'
// import moment from "moment-timezone";

const { Title, Text } = Typography

const i18n = {
  header: translate('wqi.wqi_day.header'),
  title: translate('wqi.wqi_day.title'),
}

@protectRole(ROLE.WQI_GIO.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class WQIStatisticsDay extends React.Component {
  state = {
    dataWQI: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
    wqiConfig: [],
    isLoaded: false,
    isSearched: false,
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: true,
    })

    // let listStationId = searchFormData.stationID

    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      listKey: searchFormData.listStation,
      code: searchFormData.wqiKey,
    }

    // console.log(params,searchFormData,"-----")
    let dataWQI = await wqiApi.fetchWqiDaybyListStation({ ...params })
    // console.log(dataWQI, "dataWQI")
    if (dataWQI && _.get(dataWQI, 'data', []).length === 0) {
      swal({
        type: 'warning',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }

    this.setState({
      isLoading: false,
      dataWQI: _.reverse(_.get(dataWQI, 'data', [])),
      searchFormData: searchFormData,
      isSearched: true,
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey: _.get(this.state.searchFormData, 'listStation', ''),
      code: _.get(this.state.searchFormData, 'wqiKey'),
    }
    let res = await wqiApi.exportFileWqiDaybyListStation({ ...params })
    if (res && res.success) window.location = res.data
    else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false,
    })
  }

  async handleManually() {
    this.setState({
      isManually: true,
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey: _.get(this.state.searchFormData, 'listStation', ''),
      code: _.get(this.state.searchFormData, 'wqiKey'),
    }

    let res = await wqiApi.fetchWQIProcessCalDay({ ...params })
    if (res && res.success) {
      message.success('success')
      this.loadData(this.state.pagination, this.state.searchFormData)
    } else {
      message.error('Error')
    }

    this.setState({
      isManually: false,
    })
  }

  async componentDidMount() {
    try {
      const wqiConfigListRes = await getListConfigWqi()
      let wqiConfigList = _.get(wqiConfigListRes, 'data.value', [])
      wqiConfigList = wqiConfigList.filter(item => item.activated)

      this.setState({
        wqiConfig: wqiConfigList,
        isLoaded: true,
      })
    } catch (e) {
      this.setState({ isLoaded: true })
    }
  }

  render() {
    const { wqiConfig, isLoaded } = this.state
    if (!isLoaded) return null

    const isHaveConfig = wqiConfig.length > 0
    if (!isHaveConfig)
      return (
        <ReferencesComponent
          title={translate('wqi.reference')}
          pathGoto={slug.wqi.config}
        />
      )

    const { fromDate, toDate } = this.state.searchFormData

    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin
          size="large"
          tip={translate('dataSearchFrom.tab.statusExport')}
          spinning={this.state.isExporting}
        >
          <Breadcrumb items={['list']} />
          <SearchFrom
            onSubmit={this.handleSubmitSearch}
            searchNow={this.props.formData.searchNow}
          />
          <Clearfix height={16} />
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>{i18n.header}</Title>
            {fromDate && toDate && (
              <Text>
                {translate('wqi.wqi_day.title', {
                  fromDate: moment(fromDate).format('DD/MM/YYYY'),
                  toDate: moment(toDate).format('DD/MM/YYYY'),
                })}
              </Text>
            )}
          </div>
          <TabList
            isSearched={this.state.isSearched}
            isLoading={this.state.isLoading}
            dataWQI={this.state.dataWQI}
            pagination={this.state.pagination}
            onExportExcel={this.handleExportExcel}
            nameChart={this.state.searchFormData.name}
            isExporting={this.state.isExporting}
            onManually={this.handleManually}
            isManually={this.state.isManually}
          />
        </Spin>
      </PageContainer>
    )
  }
}
