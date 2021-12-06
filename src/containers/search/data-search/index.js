import React from 'react'
import { autobind } from 'core-decorators'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Heading from 'components/elements/heading'
import DataStationAutoApi from 'api/DataStationAutoApi'
import Clearfix from 'components/elements/clearfix/index'
import createLang, { translate } from 'hoc/create-lang'
import TabList from './tab-list'
import Breadcrumb from './breadcrumb'
import SearchFrom from './search-form'
import DataAnalyze from './tab-list/tab-table-data-list/data-analyze'
import { Col, message, Row, Spin, Button } from 'antd'
import ROLE from 'constants/role'
import protectRole from 'hoc/protect-role'
import queryFormDataBrowser from 'hoc/query-formdata-browser'
import swal from 'sweetalert2'
import { isEqual as _isEqual } from 'lodash'
import { connect } from 'react-redux'
import DataInsight from 'api/DataInsight'
import SelectQCVN from 'components/elements/select-qcvn-v2'
import BoxShadowStyle from 'components/elements/box-shadow'

@protectRole(ROLE.DATA_SEARCH.VIEW)
@queryFormDataBrowser(['submit'])
@connect(state => ({
  locale: state.language.locale,
}))
@createLang
@autobind
export default class MinutesDataSearch extends React.Component {
  state = {
    dataStationAuto: [],
    dataAnalyzeStationAuto: [],
    measuringList: [],
    measuringData: [],
    searchFormData: {},
    lines: [],
    isLoading: false,
    isHaveData: false,
    isExporting: false,
    pagination: {
      current: 1,
      pageSize: 50,
    },
  }

  handleSubmitSearch(searchFormData) {
    this.setState(
      {
        measuringList: [...(searchFormData.measuringList || [])],
      },
      () => this.loadData(this.state.pagination, searchFormData)
    )
  }

  getQueryParam = searchFormData => {
    const {
      fromDate,
      toDate,
      key,
      isExceeded,
      queryType,
      qcvnList,
      measuringList,
    } = searchFormData

    const params = {
      stationKey: key,
      from: fromDate,
      to: toDate,
      isExceeded,
      dataType: queryType,
      filterBy: qcvnList,
      measuringList: measuringList.join(','),
    }
    return params
  }

  async loadData(pagination, searchFormData) {
    // console.log("LOad data ...")
    // console.log(this.state.measuringList, '==mealist')
    this.setState({
      isLoading: true,
      isHaveData: true,
    })
    let paginationQuery = pagination
    if (!_isEqual(searchFormData, this.state.searchFormData)) {
      paginationQuery = {
        ...paginationQuery,
        current: 1,
      }
    }

    let dataStationAuto = await DataStationAutoApi.getDataStationAutos(
      {
        page: paginationQuery.current,
        itemPerPage: paginationQuery.pageSize,
      },
      {
        ...searchFormData,
        queryType: 'RAW',
      }
    )

    const { stationKey, ...queryParams } = this.getQueryParam(searchFormData)

    const dataOriginal = await DataInsight.getDataOriginal(stationKey, {
      ...queryParams,
      page: paginationQuery.current,
      itemPerPage: paginationQuery.pageSize,
    })

    if (
      dataStationAuto &&
      Array.isArray(dataStationAuto.data) &&
      dataStationAuto.data.length === 0
    ) {
      swal({
        type: 'success',
        title: translate('dataSearchFrom.table.emptyText'),
      })
    }

    let dataAnalyzeStationAuto = await DataStationAutoApi.getDataAnalyzeStationAutos(
      searchFormData
    )

    this.setState(
      {
        isLoading: false,
        dataAnalyzeStationAuto: dataAnalyzeStationAuto.success
          ? dataAnalyzeStationAuto.data
          : [],
        dataStationAuto: dataStationAuto.data,
        measuringData: searchFormData.measuringData,
        measuringList: searchFormData.measuringList,
        searchFormData: searchFormData,
        pagination: {
          ...paginationQuery,
          total:
            dataStationAuto && dataStationAuto.pagination
              ? dataStationAuto.pagination.totalItem
              : 0,
        },
      },
      () => {
        const listMeaHaveData = this.state.dataAnalyzeStationAuto.map(
          mea => mea.key
        )
        // console.log(this.state.dataAnalyzeStationAuto, '==data founed')
        const meaDonHaveData = this.state.measuringList.filter(
          mea => !listMeaHaveData.includes(mea)
        )

        // console.log(meaDonHaveData, '==meaDonHaveData==')
        this.setState({
          dataAnalyzeStationAuto: [
            ...this.state.dataAnalyzeStationAuto,
            ...meaDonHaveData.map(mea => {
              return {
                key: mea,
                avg: { data: [] },
                min: { data: [] },
                max: { data: [] },
              }
            }),
          ],
        })
      }
    )
  }

  handleChangePage(pagination) {
    this.loadData({ ...pagination, pageSize: 50 }, this.state.searchFormData)
  }

  async handleExportExcel() {
    this.setState({
      isExporting: true,
    })
    let res = await DataStationAutoApi.getExportData({
      ...this.state.searchFormData,
      language: this.props.locale || 'EN',
    })
    if (res && res.success) {
      // window.location.href =  res.data
      window.open(res.data, '_blank')
      // return
    } else message.error('Export Error') //message.error(res.message)

    this.setState({
      isExporting: false,
    })
  }

  onChangeQcvn = keys => {
    console.log({ keys })
  }

  render() {
    // const t = this.props.lang.createNameSpace('dataSearchFrom.form')
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Spin
          size="large"
          tip={translate('dataSearchFrom.tab.statusExport')}
          spinning={this.state.isExporting}
        >
          <Breadcrumb items={['list']} />
          <Clearfix height={16} />
          <BoxShadowStyle>
            <Heading
              rightChildren={
                <Button
                  type="primary"
                  icon="search"
                  size="small"
                  // onClick={this.handleOnSearch}
                >
                  {this.props.lang.t('addon.search')}
                </Button>
              }
              textColor="#ffffff"
              isBackground
              fontSize={14}
              style={{ padding: '8px 16px' }}
            >
              {this.props.lang.t('addon.search')}
            </Heading>
            <SearchFrom />
          </BoxShadowStyle>
          <Clearfix height={16} />
          <DataAnalyze
            dataAnalyzeStationAuto={this.state.dataAnalyzeStationAuto}
            locale={{
              emptyText: translate('dataSearchFrom.table.emptyText'),
            }}
          />
          <Clearfix height={16} />

          <Row
            gutter={12}
            style={{ marginLeft: 16 }}
            type="flex"
            align="middle"
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {translate('dataAnalytics.standardViews')}
            </span>
            <Col span={8}>
              <SelectQCVN
                fieldValue="key"
                mode="multiple"
                maxTagCount={3}
                maxTagTextLength={18}
                onChange={this.onChangeQcvn}
              />
            </Col>
          </Row>

          <TabList
            isLoading={this.state.isLoading}
            dataAnalyzeStationAuto={this.state.dataAnalyzeStationAuto}
            measuringData={this.state.measuringData}
            measuringList={this.state.measuringList}
            dataStationAuto={this.state.dataStationAuto}
            pagination={this.state.pagination}
            onChangePage={this.handleChangePage}
            onExportExcel={this.handleExportExcel}
            nameChart={this.state.searchFormData.name}
            isExporting={this.state.isExporting}
            onChangeQcvn={this.onChangeQcvn}
          />
        </Spin>
      </PageContainer>
    )
  }
}
