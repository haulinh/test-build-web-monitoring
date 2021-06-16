import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import Clearfix from 'components/elements/clearfix'
import { translate } from 'hoc/create-lang'
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
    return (
      <PageContainer backgroundColor={'#fafbfb'}>
        <Breadcrumb items={[ 'list']} />
        <Clearfix height={16} />
        <SearchForm />
        <Clearfix height={16} />
      <Tabs defaultActiveKey='table' tabBarExtraContent={<Button type="primary" icon="download">Xuất dữ liệu</Button>}>
        <Tabs.TabPane tab="Dữ liệu" key="table" >
          <List />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Bản đồ" key="chart">
          <Chart />
        </Tabs.TabPane>
      </Tabs>
      </PageContainer>
    )
  }
}

export default WQIStationFixed
