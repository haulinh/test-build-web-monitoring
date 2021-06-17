import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Clearfix from 'components/elements/clearfix'
import {translate} from 'hoc/create-lang'
import {Button, Tabs} from 'antd'

import SearchForm from './search-form'
import Breadcrumb from './breadcrumb'
import List from './list'
import Chart from './chart'

const i18n = {
  header: translate('wqi.wqi_day.header'),
  title: translate('wqi.wqi_day.title'),
}

class WQIStationFixed extends React.Component {
  render() {
    const defaultData = [
      {
        name: 'Tram 1',
        time: '1/2020',
        wqi: 67,
      },
      {
        name: 'Tram 1',
        time: '2/2020',
        wqi: 45,
      },
      {
        name: 'Tram 1',
        time: '3/2020',
        wqi: 88
      },
      {
        name: 'Tram 2',
        time: '2/2020',
        wqi: 45,
      },
      {
        name: 'Tram 2',
        time: '3/2020',
        wqi: 88
      },
    ]

    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
        <Clearfix height={16} />
        <SearchForm />
        <Clearfix height={16} />
        <Tabs defaultActiveKey='table' tabBarExtraContent={<Button type="primary" icon="download">Xuất dữ liệu</Button>}>
          <Tabs.TabPane tab="Dữ liệu" key="table" >
            <List dataSource={defaultData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Bản đồ" key="chart">
            <Chart data={defaultData} />
          </Tabs.TabPane>
        </Tabs>
      </PageContainer>
    )
  }
}

export default WQIStationFixed
