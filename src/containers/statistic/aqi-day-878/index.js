import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
import { message } from 'antd'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import * as _ from 'lodash'
import { Spin } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import { fetchListAqiReport, createAqiReport } from 'api/AqiApi'
import { getStationsConfig } from 'api/StationConfigApi'
import moment from 'moment-timezone'
import { DD_MM_YYYY } from 'constants/format-date'
import { connect } from 'react-redux'

@protectRole(ROLE.STATISTIC.AQI)
@queryFormDataBrowser(['submit'])
@connect(state => ({
  timeZone: _.get(state, 'auth.userInfo.organization.timeZone', null),
}))
@autobind
export default class AQIStatisticsDay878 extends React.Component {
  state = {
    dataAQI: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
    listKey: '',
  }

  handleSubmitSearch(searchFormData) {
    // console.log("searchFormData", searchFormData)
    this.loadData(searchFormData)
  }

  componentDidMount = async () => {
    const responseStationConfig = await getStationsConfig({}, { config: 'AQI' })

    if (responseStationConfig.success) {
      const strJoin = responseStationConfig.data
        .map(item => {
          return item.key
        })
        .join(',')

      this.setState({
        listKey: strJoin,
      })
      // console.log(strJoin, "str")
    }
  }

  async loadData(searchFormData) {
    this.setState({
      isLoading: true,
      isHaveData: false,
    })

    // let listStationId = searchFormData.stationID

    const params = {
      fromDate: searchFormData.fromDate.utc().format(),
      toDate: searchFormData.toDate.utc().format(),
    }

    let dataAQI = []
    let res = await fetchListAqiReport(params)
    // console.log(params, "params")

    if (res.error) {
      return
    }
    const dataConvert = _.keyBy(res.data, item => {
      return moment(item.reportDate)
        .utc()
        .format(DD_MM_YYYY)
    })

    // console.log(searchFormData.fromDate.format(), "searchFormData.fromDate")

    const soNgay = searchFormData.toDate.diff(searchFormData.fromDate, 'days')
    for (let i = 0; i <= soNgay; i++) {
      const key = searchFormData.fromDate
        .utc()
        .clone()
        .add(i, 'days')
        .format(DD_MM_YYYY)

      const dateClone = searchFormData.fromDate.clone().add(i, 'days')
      const fromLabel = moment(dateClone.format()).format(
        'HH:mm [NG??Y] DD/MM/YYYY'
      )
      const toLabel = moment(dateClone.format())
        .add(24, 'hour')
        .subtract(1, 'minute')
        .format('HH:mm [NG??Y] DD/MM/YYYY')
      // console.log(fromLabel, toLabel, dateClone.format(),moment("2019-11-20T17:00:00Z").format() ,"key")
      let item = {
        stt: i + 1,
        key: i,
        name: `T??? ${fromLabel} ?????N ${toLabel}`,
        urlDownload: '',
        reportDate: searchFormData.fromDate
          .clone()
          .add(i, 'days')
          .format(),
      }
      console.log(item, key, 'item')
      if (dataConvert[key]) {
        item = {
          stt: i + 1,
          key: i,
          name: dataConvert[key].name,
          urlDownload: dataConvert[key].urlDownload,
          reportDate: dataConvert[key].reportDate,
        }
      }

      dataAQI = _.concat(dataAQI, item)
    }
    // console.log(dataAQI,"dataAQIs")
    this.setState({
      isLoading: false,
      isHaveData: true,
      dataAQI: dataAQI,
      searchFormData: searchFormData,
    })
  }

  hanldeOnCreateReport = async param => {
    const res = await createAqiReport(param)
    if (res.success) {
      message.success('T???o b??o c??o th??nh c??ng', 3)
      this.loadData(this.state.searchFormData)
    } else {
      message.success('M???ng g???p v???n ????? vui l??ng t???o l???i', 3)
    }
  }

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Clearfix height={16} />
        <Spin
          size="large"
          tip={translate('dataSearchFrom.tab.statusExport')}
          spinning={this.state.isExporting}
        >
          <Breadcrumb items={['list']} />
          <SearchFrom onSubmit={this.handleSubmitSearch} />
          <Clearfix height={16} />
          {this.state.isHaveData ? (
            <TabList
              isLoading={this.state.isLoading}
              dataAQI={this.state.dataAQI}
              pagination={this.state.pagination}
              listKey={this.state.listKey}
              // onExportExcel={this.handleExportExcel}
              onCreateReport={this.hanldeOnCreateReport}
              nameChart={this.state.searchFormData.name}
              isExporting={this.state.isExporting}
            />
          ) : null}
        </Spin>
      </PageContainer>
    )
  }
}
