import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import aqiApi from 'api/AqiApi'
import Clearfix from 'components/elements/clearfix/index'
import { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import * as _ from 'lodash'
import { message, Spin, Skeleton, Typography } from 'antd'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import { getListConfigAqi } from 'api/CategoryApi'
// import slug from 'constants/slug'
import PageAqiStatus from 'containers/aqi/aqi-list-status'
import moment from 'moment-timezone'

const { Title, Text } = Typography
const i18n = {
  reportName: translate('statistic.aqi.reportName'),
}

@protectRole(ROLE.AQI_GIO.VIEW)
@queryFormDataBrowser(['submit'])
@autobind
export default class AQIStatistics extends React.Component {
  state = {
    dataAQI: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isSearched: false,
    isExporting: false,
    isManually: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
    isNotConfig: false,
    isInitial: false,
  }
  componentDidMount = () => {
    try {
      getListConfigAqi()
        .then(async retult => {
          let data = _.get(retult, 'data.value', [])
          data = _.filter(data, item => {
            return item.activated
          })
          if (data.length === 0) {
            this.setState({
              isNotConfig: true,
            })
          }
        })
        .catch(ex => {
          this.setState({
            isNotConfig: false,
          })
          console.log(ex, '--ex--')
        })
        .finally(() => {
          setTimeout(() => {
            this.setState({
              isInitial: true,
            })
          }, 500)
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  handleSubmitSearch(searchFormData) {
    this.loadData(this.state.pagination, searchFormData)
  }

  async loadData(pagination, searchFormData) {
    this.setState({
      isLoading: true,
      isSearched: true,
    })
    const params = {
      from: searchFormData.fromDate,
      to: searchFormData.toDate,
      listKey: searchFormData.stationID,
      locale: searchFormData.aqiLocale,
    }
    let dataAQI = await aqiApi.fetchAqiHourbyStation({ ...params })
    if (dataAQI && Array.isArray(dataAQI.data) && dataAQI.data.length === 0) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }
    // console.log(_.get(dataAQI, "data"), "----")
    this.setState({
      isLoading: false,
      dataAQI: _.get(dataAQI, 'data', []),
      searchFormData: searchFormData,
    })
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })
    const params = {
      from: _.get(this.state.searchFormData, 'fromDate', ''),
      to: _.get(this.state.searchFormData, 'toDate', ''),
      listKey: _.get(this.state.searchFormData, 'stationID', ''),
      locale: _.get(this.state.searchFormData, 'aqiLocale', ''),
    }
    let res = await aqiApi.exportFileAqiHourbyStation({ ...params })
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
      listKey: _.get(this.state.searchFormData, 'stationID', ''),
      locale: _.get(this.state.searchFormData, 'aqiLocale', ''),
    }

    const processFunc = [
      aqiApi.fetchAqiProcessCalDay({ ...params }),
      aqiApi.fetchAqiProcessCalHour({ ...params }),
    ]
    let res = await Promise.all(processFunc)
    // console.log("res: ", res);
    if (res && res[0].success && res[1].success) {
      message.success('success')
      this.loadData(this.state.pagination, this.state.searchFormData)
    } else {
      message.error('Error')
    }

    this.setState({
      isManually: false,
    })
  }

  render() {
    const { fromDate, toDate } = this.state.searchFormData

    return (
      <div>
        <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
          <Clearfix height={16} />
          {!this.state.isInitial && (
            <Skeleton loading={true} paragraph={{ rows: 8 }} />
          )}
          {this.state.isInitial && (
            <React.Fragment>
              {this.state.isNotConfig && <PageAqiStatus />}
              {!this.state.isNotConfig && (
                <Spin
                  size="large"
                  tip={translate('dataSearchFrom.tab.statusExport')}
                  spinning={this.state.isExporting}
                >
                  <Breadcrumb items={['list']} />
                  <SearchFrom
                    initialValues={this.props.formData}
                    onSubmit={this.handleSubmitSearch}
                    searchNow={this.props.formData.searchNow}
                  />
                  <Clearfix height={16} />
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4}>{i18n.reportName.toUpperCase()}</Title>
                    {fromDate && toDate && (
                      <Text>
                        {translate('statistic.aqi.searchName', {
                          fromDate: moment(fromDate).format('DD/MM/YYYY'),
                          toDate: moment(toDate).format('DD/MM/YYYY'),
                        })}
                      </Text>
                    )}
                  </div>
                  <Clearfix height={16} />
                  <TabList
                    isSearched={this.state.isSearched}
                    isLoading={this.state.isLoading}
                    dataAQI={this.state.dataAQI}
                    pagination={this.state.pagination}
                    onExportExcel={this.handleExportExcel}
                    nameChart={this.state.searchFormData.name}
                    isExporting={this.state.isExporting}
                    onManually={this.handleManually}
                    isManually={this.state.isManually}
                  />
                </Spin>
              )}
            </React.Fragment>
          )}
        </PageContainer>
      </div>
    )
  }
}
