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

const i18n = {
  chart: t('wqiStationFix.chart'),
  table: t('wqiStationFix.table'),
  exportBtn: t('wqiStationFix.exportBtn'),
}

class WQIStationFixed extends React.Component {
  state = {
    list: [],
    filter: {},
    loading: false,
  }

  hasNewData = false

  fetchData = async (filter = {}) => {
    this.setState({loading: true});
    try {
      const data = await CalculateApi.getWQIStationFixed(filter);
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

  getFormatTimeFromServer = (type) => {
    if (type === 'month') return 'YYYY-MM';
    if (type === 'quarter') return 'YYYY-[Q]Q';
    if (type === 'year') return 'YYYY';
  }

  getFormatTime = (type) => {
    if (type === 'month') return MM_YYYY
    if (type === 'quarter') return QUARTER
    if (type === 'year') return YYYY
  }

  getDataList = (filterEmpty = false) => {
    const {list, filter} = this.state;
    const {type = 'month'} = filter
    const timeFormatFromBE = this.getFormatTimeFromServer(type);
    const timeFormat = this.getFormatTime(type);

    let data =
      list.map(item =>
        item.data.map((ele, idx) =>
        ({
          ...ele,
          datetime: moment(ele.datetime, timeFormatFromBE).format(timeFormat),
          point: item.point,
          size: idx === 0 ? item.data.length : null
        })
        ))
    data = data.reduce((prev, item) => [...prev, ...item], [])
    if(filterEmpty) return data.filter(item => !!item.wqiResult);
    return data
  }

  renderChart = () => {
    if(!this.hasNewData) return
    setTimeout(() => {
      const data = this.getDataList(true)
      if (this.chartRef) {
        this.chartRef.renderChart(data);
        this.hasNewData = false
      }
    })
  }

  render() {
    const {loading} = this.state;
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
          tabBarExtraContent={<Button
            type="primary"
            icon="download">{i18n.exportBtn}</Button>}>
          <Tabs.TabPane tab={i18n.table} key="table" >
            <List dataSource={this.getDataList()} loading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={i18n.chart} key="chart">
            <Chart ref={ref => this.chartRef = ref} />
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}

export default WQIStationFixed
