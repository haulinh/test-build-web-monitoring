import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Clearfix from 'components/elements/clearfix'
import {Button, Tabs} from 'antd'

import SearchForm from './search-form'
import Breadcrumb from './breadcrumb'
import List from './list'
import Chart from './chart'
import CalculateApi from 'api/CalculateApi'
import moment from 'moment'
import {translate as t} from 'hoc/create-lang';
import {MM_YYYY, YYYY, QUARTER} from 'constants/format-date'
import {get, isEmpty} from 'lodash-es'
import {downFileExcel} from 'utils/downFile'
import {getLanguage} from 'utils/localStorage'

const i18n = {
  chart: t('wqiStationFix.chart'),
  table: t('wqiStationFix.table'),
  exportBtn: t('wqiStationFix.exportBtn'),
  fileName: t('wqiStationFix.fileExport')
}

class WQIStationFixed extends React.Component {
  state = {
    list: [],
    filter: {},
    loading: false,
  }

  hasNewData = false

  //componentDidMount() {
    //this.fetchData({
      //phaseIds: '6098b6ff78536a6599f3de78',
      //pointKeys: 'K3_N_NT_CT,K2_N_DT_CD',
      //type: 'month',
      //from: '2018-12-31T17:00:00.000Z',
      //to: '2021-12-31T17:00:00.000Z'
    //}
    //)
  //}

  fetchData = async (filter = {}) => {
    this.setState({loading: true});
    try {
      const data = await CalculateApi.getWQIPeriodic(filter);
      this.setState(
        {loading: false, list: data, filter},
        () => {
          this.hasNewData = true
          this.renderChart()
        }
      );

    } catch (e) {
      this.setState({loading: false});
    }
  }

  onSearch = (params) => {
    this.fetchData(params)
  }

  getTime = (time, type) => {
    if (type === 'year') return moment(time, 'YYYY').format(YYYY)
    if (type === 'quarter') return moment(time, 'YYYY-[Q]Q').format(QUARTER)
    return moment(time, 'YYYY-MM').format(MM_YYYY)
  }

  getDataList = () => {
    const {list, filter} = this.state;
    const {type = 'month'} = filter

    const data =
      list.map(item =>
        item.data.map((ele, idx) =>
        ({
          ...ele,
          point: item.point,
          datetime: this.getTime(ele.datetime, type),
          size: idx === 0 ? item.data.length : null
        })
        ))
    return data.reduce((prev, item) => [...prev, ...item], [])
  }

  getDataChart = () => {
    const {list, filter} = this.state;
    const {type = 'month'} = filter
    const data =
      list
        .map(item => ({
          name: get(item, 'point.name'),
          data: get(item, 'data', [])
            .filter(ele => !!ele.wqiResult)
            .map(ele => ({
              name: [this.getTime(ele.datetime, type), get(item, 'point.name')].join(' - '),
              y: Math.round(get(ele, 'wqiResult.wqi')),
              color: get(ele, 'wqiResult.level.backgroundColor')
            })),
        }));
    return data
  }

  renderChart = () => {
    if (!this.hasNewData) return
    setTimeout(() => {
      const data = this.getDataChart()
      console.log(data)
      if (this.chartRef) {
        this.chartRef.renderChart(data);
        this.hasNewData = false
      }
    })
  }

  exportData = async () => {
    const {filter} = this.state;
    const results = await CalculateApi.exportWQIPeriodic({...filter, lang: getLanguage()});
    downFileExcel(results.data, i18n.fileName);
  }

  render() {
    const {loading, filter} = this.state;
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Clearfix height={16} />
        <SearchForm onSearch={this.onSearch} />
        <Clearfix height={16} />
        <Tabs
          destroyInactiveTabPane={false}
          onChange={(activeKey => activeKey === 'chart' && this.renderChart())}
          defaultActiveKey='table'
          tabBarExtraContent={
            <Button
              disabled={isEmpty(filter)}
              onClick={this.exportData}
              type="primary"
              icon="download"
            >
              {i18n.exportBtn}
            </Button>}>
          <Tabs.TabPane tab={i18n.table} key="table" >
            <List dataSource={this.getDataList()} loading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={i18n.chart} key="chart">
            <Chart ref={ref => this.chartRef = ref} />
          </Tabs.TabPane>
        </Tabs>
        <Clearfix height={24} />
      </PageContainer>
    )
  }
}

export default WQIStationFixed
