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
import {MM_YYYY, YYYY, QUARTER} from 'constants/format-date'

class WQIStationFixed extends React.Component {
  state = {
    list: [],
    filter: {},
    loading: false 
  }

  componentDidMount(){
    this.fetchData({pointKeys: 'MT5_N_CM,MT6_N_CM'})
  }

  fetchData = async (filter = {}) => {
    this.setState({loading: true});
    const data = await CalculateApi.getWQIStationFixed(filter);
    this.setState({loading: false, list: data, filter});
  }

  onSearch = (params) => {
    this.fetchData(params)
  }

  getFormatTimeFromServer = (type) => {
    if(type === 'month') return 'YYYY-MM';
    if(type === 'quarter') return 'YYYY-[Q]Q';
    if(type === 'year') return 'YYYY';
  }

  getFormatTime = (type) => {
    if(type === 'month') return MM_YYYY
    if(type === 'quarter') return QUARTER
    if(type === 'year') return YYYY
  }

  getDataList = () => {
    const {list, filter} = this.state;
    const {type = 'month'} = filter
    const timeFormatFromBE = this.getFormatTimeFromServer(type);
    const timeFormat = this.getFormatTime(type);

    const data = 
      list.map(item => 
        item.data.map((ele, idx) => 
          ({
            ...ele,
            datetime: moment(ele.datetime, timeFormatFromBE).format(timeFormat),
            point: item.point,
            size: idx === 0 ? item.data.length : null})
        ))
    return data.reduce((prev, item) => [...prev, ...item], [])
  }  

  render() {
    const {loading} = this.state; 
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Clearfix height={16} />
        <SearchForm onSearch={this.onSearch}/>
        <Clearfix height={16} />
        <Tabs defaultActiveKey='chart' tabBarExtraContent={<Button type="primary" icon="download">Xuất dữ liệu</Button>}>
          <Tabs.TabPane tab="Dữ liệu" key="table" >
            <List dataSource={this.getDataList()} loading={loading}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Bản đồ" key="chart">
            <Chart data={this.getDataList()} />
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}

export default WQIStationFixed
