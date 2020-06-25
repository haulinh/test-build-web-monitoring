import React, { PureComponent } from 'react'
import { Tabs, Button } from 'antd'
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router-dom'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import styled from 'styled-components'
import Clearfix from 'components/elements/clearfix'
import createBreadcrumb from 'shared/breadcrumb/hoc'
import TabMucDo from './tabMucDo'
import TabGiaTri from './tabGiaTri'
import TabThongSo from './tabThongSo'
import { translate } from 'hoc/create-lang'
import slug from 'constants/slug'

import { getListConfigAqi } from 'api/CategoryApi'
import * as _ from 'lodash'

const Breadcrumb = createBreadcrumb()
const { TabPane } = Tabs
const ButtonGroup = Button.Group

const Wrapper = styled.div`
  .ant-collapse {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .ant-collapse-item {
    width: 50%;
  }
  .ant-collapse-header {
    text-align: center;
  }
`

const i18n = {
  tabMucDo: translate('aqiConfigCalculation.tab1'), //"Ngưỡng mức độ",
  tabGiaTri: translate('aqiConfigCalculation.tab2'),
  tabThongSo: translate('aqiConfigCalculation.tab3'),
  pageName: translate('aqiConfigCalculation.pageName'),
}

const TAB_KEY = {
  MUC_DO: 'MUC_DO',
  GIA_TRI: 'GIA_TRI',
  THONG_SO: 'THONG_SO',
}
const TAB_NAME = {
  MUC_DO: i18n.tabMucDo,
  GIA_TRI: i18n.tabGiaTri,
  THONG_SO: i18n.tabThongSo,
}

const PREFIX_CALCULATION = 'aqi-calculation-'
const PREFIX_QC = 'aqi-qc-'
@withRouter
@autobind
export default class ConfigCalculationAQI extends PureComponent {
  state = {
    tabKey: TAB_KEY.MUC_DO,
    isLoaded: false,
    data: null,
  }

  setTabActive = tabKey => {
    this.setState({
      tabKey,
    })
  }

  componentDidMount = () => {
    getListConfigAqi()
      .then(retult => {
        const resData = _.get(retult, 'data.value', [])

        const data = _.find(resData, item => {
          return item.key === this.props.match.params.key
        })
        this.setState({
          data,
          isLoaded: true,
        })
      })
      .catch(ex => {
        this.setState({
          isLoaded: true,
        })
        console.log(ex, '--ex--')
      })
  }

  render() {
    return (
      <PageContainer isLoading={!this.state.isLoaded}>
        <Breadcrumb
          items={[
            {
              id: '1',
              name: i18n.pageName,
              href: slug.advance.configAqi,
            },
            {
              id: '2',
              name: _.get(this.state.data, 'name', ''),
            },
          ]}
        />
        <Wrapper>
          <Clearfix height={24} />
          <ButtonGroup style={{ display: 'flex' }}>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.MUC_DO)}
              type={
                this.state.tabKey === TAB_KEY.MUC_DO ? 'primary' : 'default'
              }
              style={{ flex: 1 }}
            >
              {TAB_NAME.MUC_DO}
            </Button>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.GIA_TRI)}
              type={
                this.state.tabKey === TAB_KEY.GIA_TRI ? 'primary' : 'default'
              }
              style={{ flex: 1 }}
            >
              {TAB_NAME.GIA_TRI}
            </Button>
            <Button
              onClick={this.setTabActive.bind(this, TAB_KEY.THONG_SO)}
              type={
                this.state.tabKey === TAB_KEY.THONG_SO ? 'primary' : 'default'
              }
              style={{ flex: 1 }}
            >
              {TAB_NAME.THONG_SO}
            </Button>
          </ButtonGroup>
          <Tabs
            renderTabBar={() => {
              return <div />
            }}
            activeKey={this.state.tabKey}
          >
            <TabPane tab="Ngưỡng mức độ" key={TAB_KEY.MUC_DO}>
              <Clearfix height={24} />
              <TabMucDo
                keyLevel={`${PREFIX_CALCULATION}${_.get(
                  this.state,
                  'data.key',
                  ''
                )}`}
              />
            </TabPane>
            <TabPane tab="Bảng giá trị BPi" key={TAB_KEY.GIA_TRI}>
              <Clearfix height={24} />
              <TabGiaTri
                keyQc={`${PREFIX_QC}${_.get(this.state, 'data.key', '')}`}
              />
            </TabPane>
            <TabPane tab="Thống số tính toán" key={TAB_KEY.THONG_SO}>
              <Clearfix height={24} />
              <TabThongSo
                keyQc={`${PREFIX_QC}${_.get(this.state, 'data.key', '')}`}
              />
            </TabPane>
          </Tabs>
        </Wrapper>
        <Clearfix height={50} />
      </PageContainer>
    )
  }
}
