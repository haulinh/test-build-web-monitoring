import React from 'react'
import PageContainer from 'layout/default-sidebar-layout/PageContainer'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
// import Breadcrumb from '../breadcrumb'
import { Table, Checkbox, message, Icon, Tabs, DatePicker } from 'antd'
import SearchForm from './search-form'
import * as _ from 'lodash'
import { replaceVietnameseStr } from 'utils/string'
import Breadcrumb from './breadcrumb'
import AuthApi from 'api/AuthApi'
import organizationAPI from 'api/OrganizationApi'

const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane;

export default class ConfigWQIContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      organization: {}
    }
    this.columns = [
      {
        title: translate('ftpTranfer.stationName'),
        dataIndex: 'name',
        key: 'name',
        align: 'left'
      },
      {
        title: translate('ftpTranfer.allowFtpTranfer'),
        dataIndex: 'options',
        key: 'options',
       // width: 100,
        align: 'left',
        render: (value, record) => (
          <Checkbox
            defaultChecked={_.get(value, ['transferFtp', 'allowed'])}
            onChange={checked => this.handleStationPublish(record, checked)}
          />
        )
      }
    ]
  }

   handleStationPublish = async (record, event) => {
     this.updateData(record, {allowed: _.get(event, 'target.checked', false)})
  }
 
  updateData = async (record, data) => { 
    const originData = _.get(record, 'options.transferFtp', {})
   // const rs = await StationAutoApi.transferFtp(record._id, {transferFtp: _.merge(originData, data)})
    // if (_.get(rs, 'success')) {
    //   this.loadData()
    // } else {
    //   message.success(_.get(rs, 'message'))
    // }
  }

  handleSearch = textSearch => {
    this.setState({ textSearch })
  }

  getData = () => {
    let search = _.lowerCase(this.state.textSearch)
    if (search) {
      search = replaceVietnameseStr(search)
      return _.filter(_.clone(this.state.list), ({ name }) =>
        replaceVietnameseStr(_.lowerCase(name)).indexOf(search) >= 0
      )
    }

    return _.clone(this.state.list)
  }

  async getDataOganization (){
    const userInfo = await AuthApi.getMe()
    const id = _.get(userInfo, 'data.organization._id','vasoft')
    const organizationInfo = await organizationAPI.getOrganization(id)
    this.setState({ organization: _.get(organizationInfo, 'data', {}) })
  }

  componentDidMount() {
    this.loadData()
    this.getDataOganization()
  }

  handleSaveFtpConfig = () => {
    this.getDataOganization()
  }

  async loadData() {
    const rs = await StationAutoApi.getLastLog()
    this.setState({ list: _.get(rs, 'data', [])})
  }

  
  

  render() {
    return (
      <PageContainer {...this.props.wrapperProps} backgroundColor={'#fafbfb'}>
        <Breadcrumb items={['list']} />
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><Icon type="reconciliation" />{translate('configWQI.stationAuto')}</span>} key="1" >
                <SearchForm onSearch={this.handleSearch} />
                  <Table
                    rowKey="key"
                    dataSource={this.getData()}
                    columns={this.columns}
                  />
            </TabPane >
            <TabPane tab={<span><Icon type="cluster" />{translate('configWQI.stationFixed')}</span>} key="2">
                <SearchForm onSearch={this.handleSearch} />
                  <Table
                    rowKey="key"
                    dataSource={this.getData()}
                    columns={this.columns}
                />
            </TabPane>
          </Tabs>        
      </PageContainer>
    )
  }
}
